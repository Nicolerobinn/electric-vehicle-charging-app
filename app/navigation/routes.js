import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {theme} from '../core/theme';

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

const Stack = createStackNavigator();
const AppStack = createStackNavigator();
const WSSURL = 'wss://dev.evnrgy.com:7777';

const AppScreens = ({websocket}) => (
  <AppStack.Navigator>
    <Stack.Screen
      name="LoginScreen"
      component={LoginScreen}
      options={{headerShown: false}}
      initialParams={{websocket: websocket}}
    />
    <Stack.Screen
      name="RegisterScreen"
      component={RegisterScreen}
      options={{headerShown: false}}
      initialParams={{websocket: websocket}}
    />
    <Stack.Screen
      name="ForgotPasswordScreen"
      component={ForgotPasswordScreen}
      options={{headerShown: false}}
      initialParams={{websocket: websocket}}
    />
    <Stack.Screen
      name="HomeScreen"
      component={HomeScreen}
      options={{headerShown: false}}
      initialParams={{websocket: websocket}}
    />
    <Stack.Screen
      name="SettingScreen"
      component={SettingScreen}
      options={{headerShown: false}}
      initialParams={{websocket: websocket}}
    />
    <Stack.Screen
      name="StationScreen"
      component={StationScreen}
      options={{headerShown: false}}
      initialParams={{websocket: websocket}}
    />
    <Stack.Screen
      name="ConfigurationsScreen"
      component={ConfigurationsScreen}
      options={{headerShown: false}}
      initialParams={{websocket: websocket}}
    />
  </AppStack.Navigator>
);

export const Route = () => {
  const dispatch = useDispatch();
  const token = useSelector((state) => state.appData.token);

  // instance of websocket connection as a class property
  const websocket = new WebSocket(WSSURL);

  useEffect(() => {
    websocket.onopen = () => {
      dispatch(Actions.setConnected(true));
    };

    websocket.onmessage = (evt) => {
      console.log('on message', evt);
      // listen to data sent from the websocket server
      const message = JSON.parse(evt.data);
      console.log('on message parse data', message);
      dispatch(Actions.saveMessage(message));
      if (message?.status === 'SUCCESS' && message?.token) {
        dispatch(Actions.saveToken(message.token));
      }
    };

    websocket.onclose = () => {
      console.log('disconnected');
      // clear all redux data
      dispatch(Actions.setConnected(false));
      dispatch(Actions.saveMessage({}));
      dispatch(Actions.saveToken(''));
      // automatically try to reconnect on connection loss
    };
  });

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
    <NavigationContainer theme={theme}>
      <Provider theme={combinedTheme}>
        <AppScreens options={{animationEnabled: false}} websocket={websocket} />
      </Provider>
    </NavigationContainer>
  );
};
