import React, {useState} from 'react';
import {Linking} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import {theme} from '../core/theme';

const Footer = ({navigation}) => {
  const [index, setIndex] = useState(0);
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

  const renderScene = ({route}) => {
    console.log(route);
    // todo: this line causing issues, whenever loaded, it will open home screen
    switch (route.key) {
      case 'search':
        return;
        return navigation.navigate('HomeScreen');
      case 'location':
        return;
        // TODO: update this URL
        return Linking.openURL('https://dev.evnrgy.com/');
      case 'stations':
        return;
        // todo: update this screen
        return navigation.navigate('StationScreen');
    }
  };

  return (
    <BottomNavigation
      navigationState={{index, routes}}
      onIndexChange={setIndex}
      renderScene={renderScene}
    />
  );
};

export default Footer;
