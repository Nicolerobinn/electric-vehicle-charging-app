import React, { useEffect } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { checkLoginPersistent } from '../core/asyncStorage';
// redux
import { useAppSelector, useAppDispatch } from '../store/redux-patch';
import { updateToken, setLoad } from '../store/slice/userSlice';

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

const AppScreens = () => {
  const dispatch = useAppDispatch();
  const { token, load: isLoading } = useAppSelector((state) => state.user);
  const checkLogin = async () => {
    const tok = await checkLoginPersistent();
    if (tok) {
      dispatch(updateToken(tok));
    }

    dispatch(setLoad(false));
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
      initialRouteName={token ? 'HomeScreen' : 'LoginScreen'}>
      <Stack.Screen
        name="LoginScreen"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{ headerShown: false, gestureEnabled: false }}
      />
      <Stack.Screen
        name="RegisterScreen"
        component={RegisterScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ForgotPasswordScreen"
        component={ForgotPasswordScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="SettingScreen"
        component={SettingScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StationScreen"
        component={StationScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfigurationsScreen"
        component={ConfigurationsScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfigurationsBlueToochScreen"
        component={ConfigurationsBlueToochScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="ConfigurationsWIFIScreen"
        component={ConfigurationsWIFIScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="QRScannerScreen"
        component={QRScannerScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="StationDefaultPasswordResetScreen"
        component={StationDefaultPasswordResetScreen}
        options={{ headerShown: false }}
      />
    </Stack.Navigator >
  );
};
export default AppScreens;
