import {RNCamera} from 'react-native-camera';
import React, {useEffect, useRef} from 'react';
import {
  StyleSheet,
  Animated,
  PermissionsAndroid,
  default as Easing,
  View,
  Text,
  Platform,
} from 'react-native';

let camera;

const ScanQRCode = () => {
  const moveAnim = useRef(new Animated.Value(-2)).current;

  useEffect(() => {
    requestCameraPermission();
    startAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  //请求权限的方法
  const requestCameraPermission = async () => {
    try {
      const {OS} = Platform; // android or ios
      if (OS === 'android') {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'permissions',
            message: 'Grant camera permissions',
            buttonNeutral: '等会再问我',
            buttonNegative: 'no',
            buttonPositive: 'ok',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('现在你获得摄像头权限了');
        } else {
          console.log('用户没有允许相机权限');
        }
      } else {
        console.log('现在你获得摄像头权限了');
      }
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
    const {data} = result; //只要拿到data就可以了
    //扫码后的操作
    console.log(data);
    alert(data);
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={(ref) => {
          camera = ref;
        }}
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
