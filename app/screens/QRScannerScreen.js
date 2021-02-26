import {RNCamera} from 'react-native-camera';
import {
  request,
  PERMISSIONS,
  openSettings,
  check,
  RESULTS,
} from 'react-native-permissions';
import React, {useEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  StyleSheet,
  Animated,
  PermissionsAndroid,
  default as Easing,
  View,
  Text,
  Platform,
  Alert,
} from 'react-native';
import * as Actions from '../store/Actions';
const ScanQRCode = ({route, navigation}) => {
  const moveAnim = useRef(new Animated.Value(-2)).current;
  const dispatch = useDispatch();
  const [throttle, setThrottle] = useState(false);
  useEffect(() => {
    requestCameraPermission();
    startAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const androidPermissionCheck = async () => {
    const obj = {
      title: 'permissions',
      message: 'Grant camera permissions',
      buttonNegative: 'no',
      buttonPositive: 'ok',
    };
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.CAMERA,
      obj,
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      console.log('android 现在你获得摄像头权限了');
    } else {
      console.log('用户没有允许相机权限');
    }
  };
  const getCameraPermissions = async () => {
    const res = await request(PERMISSIONS.IOS.CAMERA);
  };
  const iosPermissionCheck = async () => {
    const result = await check(PERMISSIONS.IOS.CAMERA);
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
        // 已有权限
        return;
      case RESULTS.BLOCKED:
        // TODO 拒绝时权限提示修改
        alert('The permission is denied and not requestable anymore');
        // ，可以打开注释引导用户打开设置页面主动授权
        // openSettings().catch(() => console.warn('cannot open settings'));
        break;
    }
  };
  //请求权限的方法
  const requestCameraPermission = () => {
    try {
      const {OS} = Platform; // android or ios
      OS === 'android' ? androidPermissionCheck() : iosPermissionCheck();
    } catch (err) {
      console.warn(err);
    }
  };

  /** 扫描框动画*/
  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(moveAnim, {
        toValue: 200,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(moveAnim, {
        toValue: -1,
        duration: 1500,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(() => startAnimation());
  };
  const onBarCodeRead = (result) => {
    if (throttle) {
      return;
    }
    const {data: number} = result; //只要拿到data就可以了
    //扫码后的操作
    setThrottle(true);
    Alert.alert('stationNumber', number, [
      {
        text: 'go',
        onPress: () => {
          dispatch(Actions.setQRCode(number));
          navigation.goBack(null);
        },
      },
      {
        text: 'cancel',
        onPress: () => {
          setThrottle(false);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        autoFocus={RNCamera.Constants.AutoFocus.on} /*自动对焦*/
        style={[styles.preview]}
        type={RNCamera.Constants.Type.back} /*切换前后摄像头 front前back后*/
        flashMode={RNCamera.Constants.FlashMode.off} /*相机闪光模式*/
        captureAudio={false}
        onBarCodeRead={onBarCodeRead}>
        <View
          style={{
            width: 500,
            height: 220,
            backgroundColor: 'rgba(0,0,0,0.5)',
          }}
        />

        <View style={[{flexDirection: 'row'}]}>
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              height: 200,
              width: 200,
            }}
          />
          <Animated.View
            style={[styles.border, {transform: [{translateY: moveAnim}]}]}
          />
          <View
            style={{
              backgroundColor: 'rgba(0,0,0,0.5)',
              height: 200,
              width: 200,
            }}
          />
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            width: 500,
            alignItems: 'center',
          }}>
          <Text style={styles.rectangleText}>Scan QR Code</Text>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  rectangleContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  rectangle: {
    height: 200,
    width: 200,
    borderWidth: 1,
    borderColor: '#fcb602',
    backgroundColor: 'transparent',
    borderRadius: 10,
  },
  rectangleText: {
    flex: 0,
    color: '#fff',
    marginTop: 10,
  },
  border: {
    flex: 0,
    width: 196,
    height: 2,
    backgroundColor: '#fcb602',
    borderRadius: 50,
  },
});

export default ScanQRCode;