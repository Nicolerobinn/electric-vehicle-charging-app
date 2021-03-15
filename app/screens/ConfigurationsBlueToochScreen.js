import React, {memo, useState, useRef, useEffect} from 'react';
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

import * as UUID from '../core/UUID';
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
// for send data to BLE, we need to convert it to buffer array
import {stringToBytes} from 'convert-string';

const BleManagerModule = NativeModules.BleManager;
const bleManagerEmitter = new NativeEventEmitter(BleManagerModule);

const ConfigurationsBlueTouchScreen = ({route, navigation}) => {
  const webscoketClient = useSelector((state) => state.appData.webscoketClient);
  // 储存未连接蓝牙的数据结构
  const peripherals = new Map();
  // 储存当前连接蓝牙的数据结构
  const connectedPeripherals = new Map();
  // 使用ref持久化
  const peripheralsRef = useRef(null);
  const connectedPeripheralsRef = useRef(null);
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
    let peripheral = connectedPeripheralsRef.current.get(data.peripheral);
    if (peripheral) {
      connectedPeripheralsRef.current.delete(peripheral.id);
      setConnectedPeripheralsList(
        Array.from(connectedPeripheralsRef.current.values()),
      );
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
    // Received data from 0B57B2C7-43D4-CD90-C2E5-4DDC2DBF536A characteristic BFF6F2F4-AD95-417B-832A-8BF733344F26 [3]
  };
  // 获取当前连接设备
  const retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length === 0) {
        console.log('没有连接外围设备');
      }
      for (let i = 0; i < results.length; i++) {
        connectedPeripheralsRef.current.set(results[i].id, results[i]);
      }
      setConnectedPeripheralsList(
        Array.from(connectedPeripheralsRef.current.values()),
      );
    });
  };
  // Discover ALl BLE devices
  const handleDiscoverPeripheral = (peripheral) => {
    // console.log('Discover BLE device: ', peripheral, peripheral.advertising.manufacturerData);
    // Ignore peripheral that has no name
    if (!peripheral.name) {
      return;
    }
    // 判断当前蓝牙是否已连接
    // 如果已经连接则不储存
    const obj = connectedPeripheralsRef.current.get(peripheral.id);
    if (!obj) {
      peripheralsRef.current.set(peripheral.id, peripheral);
    } else {
      connectedPeripheralsRef.current.set(peripheral.id, peripheral);
    }
  };
  // 获取rssi
  const testPeripheral = (peripheral) => {
    /* Test read current RSSI value */
    BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
      console.log('检索周边服务', peripheralData);

      BleManager.readRSSI(peripheral.id).then((rssi) => {
        console.log('检索到 RSSI value', rssi);
        let p = peripheralsRef.current.get(peripheral.id);
        if (p) {
          p.rssi = rssi;
          peripheralsRef.current.set(peripheral.id, p);
          setPeripheralsList(Array.from(peripheralsRef.current.values()));
        }
      });
    });
  };
  // 添加蓝牙/Connect to a bluetooth
  const addPeripheral = (peripheral) => {
    const ID = peripheral.id;
    BleManager.connect(ID)
      .then(() => {
        peripheralsRef.current.delete(ID);
        connectedPeripheralsRef.current.set(ID, peripheral);
        setPeripheralsList(Array.from(peripheralsRef.current.values()));
        setConnectedPeripheralsList(
          Array.from(connectedPeripheralsRef.current.values()),
        );
        // TODO: 暂时存疑，是否需要rssi数据
        // setTimeout(() => {
        //   testPeripheral(peripheral);
        // }, 900);

        // TODO: enable bluetooth
        // https://github.com/innoveit/react-native-ble-manager#enablebluetooth-android-only

        // testing
        setTimeout(() => {
          BleManager.retrieveServices(ID).then((peripheralInfo) => {
            setTimeout(() => {
              BleManager.startNotification(ID, UUID.SERVICE, UUID.LOGIN_STATUS)
                .then(() => {
                  console.log('Started notification on ' + ID);
                  setTimeout(() => {
                    const data = stringToBytes('dog');
                    BleManager.write(
                      ID,
                      UUID.SERVICE,
                      UUID.CHECK_PASSWORD,
                      data,
                    ).then(() => {
                      console.log('checking password');
                    });
                  }, 500);
                })
                .catch((error) => {
                  console.log('Notification error', error);
                });
            }, 200);
          });
        }, 900);
      })
      .catch((error) => {
        console.log('Connection error', error);
      });
  };
  // 结束扫描
  const handleStopScan = () => {
    setPeripheralsList(Array.from(connectedPeripheralsRef.current.values()));
    setPeripheralsList(Array.from(peripheralsRef.current.values()));
  };

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
        ).then((res) => {
          if (res) {
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
    ];
    Alert.alert('xxx', 'xxx', arr);
  };
  const iosPermissionCheck = async () => {
    const result = await check(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    switch (result) {
      case RESULTS.UNAVAILABLE:
        Alert.alert(
          'xxx',
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
    peripheralsRef.current = peripherals;
    connectedPeripheralsRef.current = connectedPeripherals;
    BleManager.start({showAlert: false});
    // 发现设备
    bleManagerEmitter.addListener(
      'BleManagerDiscoverPeripheral',
      handleDiscoverPeripheral,
    );
    // 结束设备扫描。
    // The scanning for peripheralsRef.current is ended.
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
    startScan();
    console.log('remove', station);
  };
  const add = (station) => () => {
    addPeripheral(station);
    console.log('Add station', station);
    return;
    navigation.navigate('StationDefaultPasswordResetScreen', {
      station: station,
    });
    console.log('add', station);
  };
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
          buttonText="Remove"
          boxTitle="Authenticated Devices"
          arr={connectedPeripheralsList}
          change={remove}
        />
        <BlueToothList
          boxTitle="Avaliable Devices"
          arr={peripheralsList}
          buttonText="Add"
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

export default memo(ConfigurationsBlueTouchScreen);
