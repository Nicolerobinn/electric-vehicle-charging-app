import React, {useState, memo, useEffect} from 'react';
import {Linking} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import {theme} from '../core/theme';
import {useSelector} from 'react-redux';

const HOME_SCREEN = 'HomeScreen';
const BLUETOOTH_SCREEN = 'ConfigurationsBlueToochScreen';
const Footer = ({navigation}) => {
  const [index, setIndex] = useState(0);

  const currentRoute = useSelector((state) => state.appData.currentRoute);
  // useEffect(() => {
  //   switch (currentRoute) {
  //     case HOME_SCREEN:
  //       setIndex(0);
  //       break;
  //     case BLUETOOTH_SCREEN:
  //       setIndex(2);
  //       break;
  //     default:
  //       break;
  //   }
  // }, [currentRoute]);
  const [routes] = useState([
    {
      key: 'search',
      title: 'Search',
      icon: 'magnify',
    },
    {
      key: 'location',
      title: 'Join Location',
      icon: 'ev-station',
    },
    {
      key: 'stations',
      title: 'Home Stations',
      icon: 'plus',
    },
  ]);
  const indexChange = (i) => {
    if (i === 1) {
      Linking.openURL('https://dev.evnrgy.com/');
      return;
    }
    setIndex(i);
  };
  const renderScene = ({route}) => {
    // todo: this line causing issues, whenever loaded, it will open home screen
    // switch (route.key) {
    //   case 'search':
    //     return navigation.navigate(HOME_SCREEN);
    //   case 'stations':
    //     return navigation.navigate(BLUETOOTH_SCREEN);
    // }
  };

  return (
    <BottomNavigation
      style={{flex: 0}}
      navigationState={{index, routes}}
      onIndexChange={indexChange}
      renderScene={renderScene}
    />
  );
};

export default memo(Footer);
