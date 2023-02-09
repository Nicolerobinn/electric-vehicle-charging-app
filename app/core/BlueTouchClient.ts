import {
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
import BleManager from 'react-native-ble-manager';
// for send data to BLE, we need to convert it to buffer array
import {stringToBytes} from 'convert-string';
import * as UUID from '../core/UUID';
import {removeHomeStation} from '../core/asyncStorage';
import * as Actions from '../store/Actions';

const BLE_DISCOVER = 'BleManagerDiscoverPeripheral';
const BLE_STOP = 'BleManagerStopScan';
const BLE_DIS = 'BleManagerDisconnectPeripheral';
const BLE_UPDATE = 'BleManagerDidUpdateValueForCharacteristic';

export default class BlueTouchClient {
  bleManagerEmitter = null;
  // 未连接设备
  connectedPeripheralsperipherals = null;
  // 已连接设备
  connectedPeripherals = null;
  // 扫描状态
  isScanning = true;
  // 派发
  dispatch = null;
  constructor(dispatch) {
    // 初始化设备发射器
    const BleManagerModule = NativeModules.BleManager;
    this.bleManagerEmitter = new NativeEventEmitter(BleManagerModule);
    this.dispatch = dispatch;
    // 大量读写 使用map数据结构
    this.connectedPeripherals = new Map();
    this.peripherals = new Map();

    // 通过方法判断 设备平台以及版本
    const {OS, Version} = Platform;
    if (OS === 'android' && Version >= 23) {
      this.androidPermissionCheck();
    } else if (OS === 'ios') {
      this.iosPermissionCheck();
    }
  }
  // 初始化蓝牙单例
  static getInstance(dispatch) {
    if (!this.instance) {
      this.instance = new BlueTouchClient(dispatch);
    }
    return this.instance;
  }

  // 权限获取部分
  // android设备权限验证
  androidPermissionCheck = async () => {
    PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    ).then((result) => {
      if (result) {
        this.startScan();
        console.log('Permission is OK');
      } else {
        PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        ).then((res) => {
          if (res) {
            this.startScan();
            console.log('用户接受');
          } else {
            console.log('用户拒绝');
          }
        });
      }
    });
  };
  // 获取相机权限
  getCameraPermissions = async () => {
    const res = await request(PERMISSIONS.IOS.BLUETOOTH_PERIPHERAL);
    this.startScan();
  };
  // 提示弹框
  messageAlert = () => {
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
  // ios设备权限验证
  iosPermissionCheck = async () => {
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
        this.getCameraPermissions();
        break;
      case RESULTS.LIMITED:
        console.log('The permission is limited: some actions are possible');
        break;
      case RESULTS.GRANTED:
        this.startScan();
        console.log('BLUE_TOUCH_GRANTED');
        // 已有权限
        return;
      case RESULTS.BLOCKED:
        // TODO 拒绝时权限提示修改
        // 引导用户打开设置页面主动授权
        this.messageAlert();
        break;
    }
  };

  // 对于方法的挂载和卸载部分，只执行一次 ，在App.js中，组件生命周期中严禁二次调用
  // 挂载蓝牙
  mountBlueTouchClint() {
    BleManager.start({showAlert: false});
    // 发现设备
    this.bleManagerEmitter.addListener(
      BLE_DISCOVER,
      this.handleDiscoverPeripheral,
    );
    // 结束设备扫描。
    // The scanning for peripherals is ended.
    this.bleManagerEmitter.addListener(BLE_STOP, this.handleStopScan);
    // 一个设备被断开
    // A peripheral was disconnected.
    this.bleManagerEmitter.addListener(
      BLE_DIS,
      this.handleDisconnectedPeripheral,
    );
    // 一个新的特征通知内容
    // A characteristic notify a new value.
    this.bleManagerEmitter.addListener(
      BLE_UPDATE,
      this.handleUpdateValueForCharacteristic,
    );
  }
  // 卸载蓝牙
  unMountBlueTouchClint() {
    this.bleManagerEmitter.removeListener(
      BLE_DISCOVER,
      this.handleDiscoverPeripheral,
    );
    this.bleManagerEmitter.removeListener(BLE_STOP, this.handleStopScan);
    this.bleManagerEmitter.removeListener(
      BLE_DIS,
      this.handleDisconnectedPeripheral,
    );
    this.bleManagerEmitter.removeListener(
      BLE_UPDATE,
      this.handleUpdateValueForCharacteristic,
    );
  }

  // 封装的蓝牙方法部分
  // 扫描蓝牙
  startScan = () => {
    BleManager.scan([], 3, true)
      .then((results) => {
        this.isScanning = true;
        console.log('扫描...');
      })
      .catch((err) => {
        console.error(err);
      });
  };
  // 断开蓝牙
  handleDisconnectedPeripheral = (data) => {
    let peripheral = this.connectedPeripherals.get(data.peripheral);
    if (peripheral) {
      this.connectedPeripherals.delete(peripheral.id);
    }
    console.log('Disconnected from ' + data.peripheral);
  };
  // 收到数据通知
  handleUpdateValueForCharacteristic = (data) => {
    const {peripheral, characteristic, value} = data;
    const efferenceStr = `Received data from ${peripheral} characteristic ${characteristic} ${value}`;
    console.log('====================================');
    console.log(efferenceStr);
    console.log('====================================');
    // Received data from 0B57B2C7-43D4-CD90-C2E5-4DDC2DBF536A characteristic BFF6F2F4-AD95-417B-832A-8BF733344F26 [3]
  };
  // 获取当前连接设备
  retrieveConnected = () => {
    BleManager.getConnectedPeripherals([]).then((results) => {
      if (results.length === 0) {
        console.log('没有连接外围设备');
      }
      for (let i = 0; i < results.length; i++) {
        this.connectedPeripherals.set(results[i].id, results[i]);
      }
    });
  };
  // Discover ALl BLE devices
  handleDiscoverPeripheral = (peripheral) => {
    // console.log('Discover BLE device: ', peripheral, peripheral.advertising.manufacturerData);
    // Ignore peripheral that has no name
    if (!peripheral.name) {
      peripheral.name = peripheral.id;
    }
    // 判断当前蓝牙是否已连接
    // 如果已经连接则不储存
    const obj = this.connectedPeripherals?.get(peripheral.id);
    if (!obj) {
      this.peripherals?.set(peripheral.id, peripheral);
    } else {
      this.connectedPeripherals?.set(peripheral.id, peripheral);
    }
  };
  // 结束扫描
  handleStopScan = () => {
    console.log('扫描结束');
    this.isScanning = false;
    this.dispatchActionColl();
    console.log(this.getBlueTouchList());
  };
  // 密码校验
  blueTouchCheckPassword = (ID, password) => {
    setTimeout(() => {
      BleManager.retrieveServices(ID).then((peripheralInfo) => {
        setTimeout(() => {
          BleManager.startNotification(ID, UUID.SERVICE, UUID.LOGIN_STATUS)
            .then(() => {
              console.log('Started notification on ' + ID);
              setTimeout(() => {
                BleManager.write(
                  ID,
                  UUID.SERVICE,
                  UUID.CHECK_PASSWORD,
                  password,
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
  };
  // 移除蓝牙
  removeBlueConnect = async (station) => {
    removeHomeStation(station);
    await BleManager.disconnect(station.id);
    this.startScan();
    this.retrieveConnected();
  };
  // 连接蓝牙
  blueConnect = async (peripheral) => {
    const ID = peripheral.id;
    try {
      await BleManager.connect(ID);
      this.peripherals.delete(ID);
      this.connectedPeripherals.set(ID, peripheral);
      const psd = stringToBytes('dog');
      this.blueTouchCheckPassword(ID, psd);
      this.dispatchActionColl();
      // 可以使用 async/await 封装回传不使用派发
      // return this.getBlueTouchList();
    } catch (error) {
      console.log('Connection error', error);
      return {};
    }
  };

  // 获取rssi
  // 函数需要修改
  testPeripheral = (peripheral) => {
    /* Test read current RSSI value */
    BleManager.retrieveServices(peripheral.id).then((peripheralData) => {
      console.log('检索周边服务', peripheralData);

      BleManager.readRSSI(peripheral.id).then((rssi) => {
        console.log('检索到 RSSI value', rssi);
        let p = this.peripherals.get(peripheral.id);
        if (p) {
          p.rssi = rssi;
          this.peripherals.set(peripheral.id, p);
          const arr = Array.from(this.peripherals.values());
        }
      });
    });
  };
  // 派发集合
  dispatchActionColl() {
    this.dispatch(Actions.setBlueTouchCollection(this.getBlueTouchList()));
  }
  // 获取蓝牙列表
  getBlueTouchList = () => {
    return {
      peripherals: Array.from(this.peripherals.values()),
      connectedPeripherals: Array.from(this.connectedPeripherals.values()),
    };
  };
}
