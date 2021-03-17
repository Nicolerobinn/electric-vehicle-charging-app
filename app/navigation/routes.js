import React, {useEffect, useState, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from '../core/theme';
import WebSocketClient from '../core/WebSocketClient';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme, Provider} from 'react-native-paper';
import {checkLoginPersistent} from '../core/asyncStorage';
// redux
import {useSelector, useDispatch} from 'react-redux';
import * as Actions from '../store/Actions';

// screens
import {
  HomeScreen,
  LoginScreen,
  RegisterScreen,
  SettingScreen,
  ForgotPasswordScreen,
  StationScreen,
  ConfigurationsScreen,
  SplashScreen,
  StationDefaultPasswordResetScreen,
  QRScannerScreen,
  ConfigurationsWIFIScreen,
  ConfigurationsBlueToochScreen,
} from '../screens/index';
const Stack = createStackNavigator();

const isLogin = () => {
  return (
    <>
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
    </>
  );
};
const goLogin = () => {
  return (
    <>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false, gestureEnabled: false}}
      />
    </>
  );
};
const AppScreens = () => {
  const dispatch = useDispatch();
  const appData = useSelector((state) => state.appData);
  const {token, isLoading} = appData;
  const checkLogin = async () => {
    const tok = await checkLoginPersistent();
    if (tok) {
      dispatch(Actions.saveToken(tok));
    }

    dispatch(Actions.setLoad(false));
  };
  useEffect(() => {
    // 检查登录保持
    checkLogin();
  }, []);
  if (isLoading) {
    // We haven't finished checking for the token yet
    return <SplashScreen />;
  }

  return (
    <Stack.Navigator
      initialRouteName={token ? 'HomeScreen' : 'LoginScreen'}
      options={{animationEnabled: false}}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{headerShown: false, gestureEnabled: false}}
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
    </Stack.Navigator>
  );
};

export const Route = () => {
  const navigationRef = useRef();
  const dispatch = useDispatch();
  useEffect(() => {
    // 初始化webscoket
    WebSocketClient.getInstance(dispatch).initWebSocket();
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
        <AppScreens />
      </Provider>
    </NavigationContainer>
  );
};
