import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
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
export default AppScreens;
