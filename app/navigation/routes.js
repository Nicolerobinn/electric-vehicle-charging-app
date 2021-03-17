import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from '../core/theme';
import WebSocketClient from '../core/WebSocketClient';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme, Provider} from 'react-native-paper';
import {checkLoginPersistent} from '../core/asyncStorage';
// redux
import {useDispatch} from 'react-redux';
import * as Actions from '../store/Actions';

// screens
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import SettingScreen from '../screens/SettingScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import StationScreen from '../screens/StationScreen';
import ConfigurationsScreen from '../screens/ConfigurationsScreen';
import ConfigurationsBlueToochScreen from '../screens/ConfigurationsBlueToochScreen';
import ConfigurationsWIFIScreen from '../screens/ConfigurationsWIFIScreen';
import QRScannerScreen from '../screens/QRScannerScreen';
import StationDefaultPasswordResetScreen from '../screens/StationDefaultPasswordResetScreen';

const Stack = createStackNavigator();
const AppStack = createStackNavigator();

const AppScreens = () => (
  <AppStack.Navigator>
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="HomeScreen"
      initialRouteName
      component={HomeScreen}
      options={{headerShown: false, gestureEnabled: false}}
    />
    <Stack.Screen
      name="SettingScreen"
      component={SettingScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="StationScreen"
      component={StationScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ConfigurationsScreen"
      component={ConfigurationsScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ConfigurationsBlueToochScreen"
      component={ConfigurationsBlueToochScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="ConfigurationsWIFIScreen"
      component={ConfigurationsWIFIScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="QRScannerScreen"
      component={QRScannerScreen}
      options={{headerShown: false}}
    />
    <Stack.Screen
      name="StationDefaultPasswordResetScreen"
      component={StationDefaultPasswordResetScreen}
      options={{headerShown: false}}
    />
  </AppStack.Navigator>
);

export const Route = () => {
  const navigationRef = useRef();
  const dispatch = useDispatch();
  const checkLogin = async () => {
    const token = await checkLoginPersistent();
    if (token) {
      dispatch(Actions.saveToken(token));
      navigationRef.current?.navigate('HomeScreen');
    }
  };
  useEffect(() => {
    // 初始化webscoket
    WebSocketClient.getInstance(dispatch).initWebSocket();
    // 检查登录保持
    checkLogin();
  }, []);
  const routeChange = () => {
    const {name} = navigationRef.current.getCurrentRoute();
    dispatch(Actions.setCurrentRoute(name));
  };
  // overwrite react-native-paper theme
  const combinedTheme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
      secondary: theme.colors.secondary,
      error: theme.colors.error,
    },
  };

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={routeChange}
      theme={theme}>
      <Provider theme={combinedTheme}>
        <AppScreens options={{animationEnabled: false}} />
      </Provider>
    </NavigationContainer>
  );
};
