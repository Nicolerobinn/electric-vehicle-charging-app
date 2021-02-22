import React, {useEffect, useRef} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from '../core/theme';
import WebSocketClient from '../core/WebSocketClient';
import {createStackNavigator} from '@react-navigation/stack';
import {DefaultTheme, Provider} from 'react-native-paper';

// redux
import {useSelector, useDispatch} from 'react-redux';
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

const Stack = createStackNavigator();
const AppStack = createStackNavigator();
const WSSURL = 'wss://dev.evnrgy.com:7777';

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
  </AppStack.Navigator>
);

export const Route = () => {
  const navigationRef = useRef();
  const webscoket = useRef();
  const dispatch = useDispatch();
  const token = useSelector((state) => state.appData.token);
  // instance of webscoket connection as a class property
  const onMessage = (evt) => {
    // listen to data sent from the webscoket server
    const message = JSON.parse(evt.data);
    dispatch(Actions.saveMessage(message));
    console.log('message', message);
    if (message?.status === 'SUCCESS' && message?.token) {
      dispatch(Actions.saveToken(message.token));
    }
  };
  const onClose = () => {
    console.log('disconnected');
    // clear all redux data
    dispatch(Actions.setConnected(false));
    dispatch(Actions.saveMessage({}));
    dispatch(Actions.saveToken(''));
    // automatically try to reconnect on connection loss
  };
  const onOpen = () => {
    dispatch(Actions.setWebscoketClient(webscoket.current));
    dispatch(Actions.setConnected(true));
  };
  useEffect(() => {
    webscoket.current = new WebSocketClient({
      onOpen: onOpen,
      onMessage: onMessage,
      onClose: onClose,
    });
    webscoket.current.initWebSocket();
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
