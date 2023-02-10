import { RNCamera, type BarCodeReadEvent } from 'react-native-camera';
import {
  request,
  PERMISSIONS,
  openSettings,
  check,
  RESULTS,
} from 'react-native-permissions';
import { Button } from 'react-native-paper';
import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  StyleSheet,
  Animated,
  PermissionsAndroid,
  Easing,
  View,
  Text,
  Platform,
  Alert, type AlertButton
} from 'react-native';
import * as Actions from '../store/Actions';
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ParamListBase>;

const ScanQRCode = ({ navigation }: Props) => {
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
        Alert.alert(
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
        console.log('CAMERA PERMISSIONS GRANTED');
        // 已有权限
        return;
      case RESULTS.BLOCKED:
        // TODO 拒绝时权限提示修改
        // 引导用户打开设置页面主动授权
        Alert.alert('xxx', 'xxx', [
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
        ] as AlertButton[]);
        break;
    }
  };
  //请求权限的方法
  const requestCameraPermission = () => {
    try {
      const { OS } = Platform; // android or ios
      OS === 'android' ? androidPermissionCheck() : iosPermissionCheck();
    } catch (err) {
      console.warn(err);
    }
  };

  /** 扫描框动画*/
  const startAnimation = () => {
    Animated.sequence([
      Animated.timing(moveAnim, {
        toValue: 500,
        duration: 4000,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
      Animated.timing(moveAnim, {
        toValue: -1,
        duration: 0,
        easing: Easing.linear,
        useNativeDriver: false,
      }),
    ]).start(() => startAnimation());
  };
  const onBarCodeRead = (result: BarCodeReadEvent) => {
    if (throttle) {
      return;
    }
    const { data: number } = result; //只要拿到data就可以了
    //扫码后的操作
    setThrottle(true);
    Alert.alert('stationNumber', number, [
      {
        text: 'go',
        onPress: () => {
          dispatch(Actions.setQRCode(number));
          navigation.goBack();
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
    <RNCamera
      autoFocus={RNCamera.Constants.AutoFocus.on} /*自动对焦*/
      style={[styles.preview]}
      type={RNCamera.Constants.Type.back} /*切换前后摄像头 front前back后*/
      flashMode={RNCamera.Constants.FlashMode.off} /*相机闪光模式*/
      captureAudio={false}
      onBarCodeRead={onBarCodeRead}>
      <Button
        style={styles.button}
        icon="arrow-left"
        mode="contained"
        labelStyle={{ marginLeft: 0 }}
        uppercase={false}
        onPress={() => navigation.goBack()}
      ><></></Button>
      <View style={{ width: '80%', height: '60%' }}>
        <Animated.View
          style={[styles.border, { transform: [{ translateY: moveAnim }] }]}
        />
      </View>
      <Text style={styles.rectangleText}>Scan QR Code</Text>
    </RNCamera>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 60,
    minWidth: 'auto',
    position: 'absolute',
    left: 26,
    top: 60,
    textAlign: 'center',
  },
  preview: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 10,
  },
  rectangleText: {
    color: '#fff',
  },
  border: {
    flex: 0,
    width: '100%',
    height: 2,
    backgroundColor: '#fcb602',
    borderRadius: 50,
    shadowColor: '#fcb602',
  },
});

export default ScanQRCode;
