import React, {memo, useState, useEffect} from 'react';
import {
  StyleSheet,
  ScrollView,
  NativeModules,
  NativeEventEmitter,
  Platform,
  PermissionsAndroid,
  Alert,
} from 'react-native';
import {
  request,
  PERMISSIONS,
  openSettings,
  check,
  RESULTS,
} from 'react-native-permissions';

import BlueToothList from '../components/BlueToothList';
import BleManager from 'react-native-ble-manager';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/Feather';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import {List} from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {removeHomeStation} from '../core/asyncStorage';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ConfigurationsBlueToochScreen = ({route, navigation}) => {
  const webscoketClient = useSelector((state) => state.appData.webscoketClient);
  // 储存未连接蓝牙的数据结构
  const peripherals = new Map();
  // 储存当前连接蓝牙的数据结构
  const connectedPeripherals = new Map();
  // 储存未连接蓝牙的list
  const [peripheralsList, setPeripheralsList] = useState([]);
  // 储存当前连接蓝牙的list
  const [connectedPeripheralsList, setConnectedPeripheralsList] = useState([]);
  // 开始扫描蓝牙
  const startScan = () => {
    BleManager.scan([], 3, true)
      .then((results) => {
        console.log('扫描...');
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // 断开蓝牙
  const handleDisconnectedPeripheral = (data) => {
    let peripheral = connectedPeripherals.get(data.peripheral);
    if (peripheral) {
      connectedPeripherals.delete(peripheral.id);
      setConnectedPeripheralsList(Array.from(connectedPeripherals.values()));
    }
    console.log('Disconnected from ' + data.peripheral);
  };
  // 收到数据通知
  const handleUpdateValueForCharacteristic = (data) => {
    console.log(
      'Received data from ' +
        data.peripheral +
        ' characteristic ' +
        data.characteristic,
      data.value,
    );
  };
  // 获取当前连接设备
  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length === 0) {
        console.log('没有连接外围设备');
      }
      for (let i = 0; i < results.length; i++) {
        connectedPeripherals.set(results[i].id, results[i]);
      }
      setConnectedPeripheralsList(Array.from(connectedPeripherals.values()));
    });
  };
  // 获取到蓝牙设备
  const handleDiscoverPeripheral = (peripheral) => {
    console.log('获取到ble设备', peripheral);
    // TODO: 通过station充电站 的蓝牙特定字段
    // 判断是否为station充电站，如果不是则不添加到可显示蓝牙列表
    if (!peripheral.name) {
      peripheral.name = 'NO NAME';
    }
    // 判断当前蓝牙是否已连接
    // 如果已经连接则不储存
    const obj = connectedPeripherals.get(peripheral.id);
    if (!obj) {
      peripherals.set(peripheral.id, peripheral);
      setPeripheralsList(Array.from(peripherals.values()));
    }
    console.log('peripherals', Array.from(peripherals.values()).length);
  };
  // 获取rssi
  const testPeripheral = (peripheral) => {
    /* Test read current RSSI value */
    BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
      console.log('检索周边服务', peripheralData);

      BleManager.readRSSI(peripheral.id).then((rssi) => {
        console.log('检索到 RSSI value', rssi);
        let p = peripherals.get(peripheral.id);
        if (p) {
          p.rssi = rssi;
          peripherals.set(peripheral.id, p);
          setPeripheralsList(Array.from(peripherals.values()));
        }
      });
    });
  };
  // 添加蓝牙
  const addPeripheral = (peripheral) => {
    BleManager.connect(peripheral.id)
      .then(() => {
        console.log('peripherals', Array.from(peripherals.values()));
        peripherals.delete(peripheral.id);
        console.log('delete peripherals', Array.from(peripherals.values()));
        connectedPeripherals.set(peripheral.id, peripheral);
        setPeripheralsList(Array.from(peripherals.values()));
        setConnectedPeripheralsList(Array.from(connectedPeripherals.values()));
        console.log('Connected to ' + peripheral.id);
        // TODO: 暂时存疑，是否需要rssi数据
        // setTimeout(() => {
        //   testPeripheral(peripheral);
        // }, 900);
      })
      .catch((error) => {
        console.log('Connection error', error);
      });
  };
  // 结束扫描
  const handleStopScan = () => console.log('结束扫描');

  // 权限校验与反馈
  const androidPermissionCheck = async () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((result) => {
      if (result) {
        startScan();
        console.log('Permission is OK');
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then((result) => {
          if (result) {
            startScan();
            console.log('用户接受');
          } else {
            console.log('用户拒绝');
          }
        });
      }
    });
  };
  const getCameraPermissions = async () => {
    const res = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    startScan();
  };
  const messageAlert = () => {
    const arr = [
      {
        text: 'Cancel',
        onPress: () => console.log('Cancel'),
        style: 'cancel',
      },
      {
        text: 'OK',
        onPress: () =>
          openSettings().catch(() => console.warn('cannot open settings')),
      },
      ,
    ];
    Alert.alert('xxx', 'xxx', arr);
  };
  const iosPermissionCheck = async () => {
    const result = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        alert(
          'This feature is not available (on this device / in this context)',
        );
        break;
      case RESULTS.DENIED:
        // 获取权限
        'The permission has not been requested / is denied but requestable';
        getCameraPermissions();
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        startScan();
        console.log('GRANTED');
        // 已有权限
        return;
      case RESULTS.BLOCKED:
        // TODO 拒绝时权限提示修改
        // 引导用户打开设置页面主动授权
        messageAlert();
        break;
    }
  };

  // 初始化方法
  useEffect(() => {
    // 开始扫描
    BleManager.start({showAlert: false});
    // 发现设备
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    // 结束设备扫描。
    // The scanning for peripherals is ended.
    bleManagerEmitter.addListener('BleManagerStopScan', handleStopScan);
    // 一个设备被断开
    // A peripheral was disconnected.
    bleManagerEmitter.addListener(
      'BleManagerDisconnectPeripheral',
      handleDisconnectedPeripheral,
    );
    // 一个新的特征通知内容
    // A characteristic notify a new value.
    bleManagerEmitter.addListener(
      'BleManagerDidUpdateValueForCharacteristic',
      handleUpdateValueForCharacteristic,
    );
    const {OS, Version} = Platform;
    if (OS === 'android' && Version >= 23) {
      androidPermissionCheck();
    } else if (OS === 'ios') {
      iosPermissionCheck();
    }

    return () => {
      console.log('卸载');
      bleManagerEmitter.removeListener(
        'BleManagerDiscoverPeripheral',
        handleDiscoverPeripheral,
      );
      bleManagerEmitter.removeListener('BleManagerStopScan', handleStopScan);
      bleManagerEmitter.removeListener(
        'BleManagerDisconnectPeripheral',
        handleDisconnectedPeripheral,
      );
      bleManagerEmitter.removeListener(
        'BleManagerDidUpdateValueForCharacteristic',
        handleUpdateValueForCharacteristic,
      );
    };
  }, []);

  // 添加蓝牙和移除蓝牙
  const remove = (station) => () => {
    BleManager.disconnect(station.id);
    retrieveConnected();
    removeHomeStation(station);
    console.log('remove', station);
  };
  const add = (station) => () => {
    addPeripheral(station);
    return;
    navigation.navigate('StationDefaultPasswordResetScreen', {
      station: station,
    });
    console.log('add', station);
  };
  [
    {
      advertising: {
        isConnectable: 1,
        kCBAdvDataRxPrimaryPHY: 0,
        kCBAdvDataRxSecondaryPHY: 0,
        kCBAdvDataTimestamp: 636029318.953386,
        txPowerLevel: 12,
      },
      id: '211EDD7A-6526-C316-8D8F-37640E930668',
      name: 'NO NAME',
      rssi: -51,
    },
    {
      advertising: {
        isConnectable: 1,
        kCBAdvDataRxPrimaryPHY: 0,
        kCBAdvDataRxSecondaryPHY: 0,
        kCBAdvDataTimestamp: 636029319.10553,
        txPowerLevel: 8,
      },
      id: '232B5E21-C7FF-A0BA-339C-D2921B2AC537',
      name: 'NO NAME',
      rssi: -53,
    },
    {
      advertising: {
        isConnectable: 1,
        kCBAdvDataRxPrimaryPHY: 0,
        kCBAdvDataRxSecondaryPHY: 0,
        kCBAdvDataTimestamp: 636029318.757321,
        localName: 'Mi Smart Band 5',
        manufacturerData: [Object],
        serviceUUIDs: [Array],
      },
      id: 'D32F4CE3-2CD6-0781-504E-43FA4C4B0EA3',
      name: 'Mi Smart Band 5',
      rssi: -71,
    },
  ];
  return (
    <SafeAreaViewBox>
      <Header navigation={navigation} />
      <ConfigurationsTopBox text="HOME STATIONS" />
      <ScrollView style={{flex: 1}}>
        <List.Item
          style={styles.titleItem}
          title="Bluetooth"
          left={(props) => (
            <Icon size={18} style={styles.right} name="bluetooth" />
          )}
        />
        <BlueToothList
          buttonText="remove"
          boxTitle="Authenticated Devices"
          arr={connectedPeripheralsList}
          change={remove}
        />
        <BlueToothList
          boxTitle="Avaliable Devices"
          arr={peripheralsList}
          buttonText="add"
          change={add}
        />
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  right: {
    top: 6,
    color: 'gray',
  },
  titleItem: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  item: {paddingBottom: 0, paddingTop: 0, paddingLeft: 25},
});

export default memo(ConfigurationsBlueToochScreen);
