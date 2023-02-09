import {  DefaultTheme } from '@react-navigation/native';
// TODO: Change the topic mode to redux/toolkit to control global variable switching 
// mode type dark/light/follower system

export const theme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: '#0e3f94', 
  },
};
