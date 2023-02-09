import React, { useEffect } from 'react';
import { NavigationContainer, useNavigationContainerRef } from '@react-navigation/native';
import { theme } from '../core/theme';
import WebSocketClient from '../core/WebSocketClient';
import BlueTouchClient from '../core/BlueTouchClient';
import { DefaultTheme, Provider } from 'react-native-paper';
// redux
import { useDispatch } from 'react-redux';
import * as Actions from '../store/Actions';
import AppScreens from './AppScreens';
const Route = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    // 初始化webscoket
    // 挂载蓝牙功能
    BlueTouchClient.getInstance(dispatch).mountBlueTouchClint();
    WebSocketClient.getInstance(dispatch).initWebSocket();
    return () => {
      BlueTouchClient.getInstance().unMountBlueTouchClint();
    };
  }, []);
  const navigationRef = useNavigationContainerRef(); // You can also use a regular ref with `React.useRef()`

  const routeChange = () => {
    const name = navigationRef.getCurrentRoute();
    dispatch(Actions.setCurrentRoute(name));
  };
  // overwrite react-native-paper theme
  const combinedTheme = {
    ...DefaultTheme,
    roundness: 2,
    colors: {
      ...DefaultTheme.colors,
      primary: theme.colors.primary,
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
export default Route;
