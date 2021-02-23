import React, {useState, memo, useEffect} from 'react';
import {Linking, StyleSheet, View, Text, TouchableOpacity} from 'react-native';
import {BottomNavigation} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import {theme} from '../core/theme';
import {useSelector} from 'react-redux';

const HOME_SCREEN = 'HomeScreen';
const BLUETOOTH_SCREEN = 'ConfigurationsBlueToochScreen';
const Footer = ({navigation}) => {
  const userData = useSelector((state) => state.appData.userData);
  const {homeStationList = []} = userData || {};
  const [index, setIndex] = useState(0);

  const currentRoute = useSelector((state) => state.appData.currentRoute);
  const [routes, setRoutes] = useState([
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
  useEffect(() => {
    switch (currentRoute) {
      case HOME_SCREEN:
        setIndex(0);
        break;
      case BLUETOOTH_SCREEN:
        setIndex(2);
        break;
      default:
        setIndex('');
        break;
    }
  }, [currentRoute]);
  useEffect(() => {
    if (homeStationList.length > 0) {
      setRoutes([
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
          icon: 'ev-station',
        },
      ]);
    }
  }, [homeStationList.length]);
  const indexChange = (i) => () => {
    if (i === 1) {
      Linking.openURL('https://dev.evnrgy.com/');
      return;
    }
    setIndex(i);
    switch (i) {
      case 0:
        navigation.navigate(HOME_SCREEN);
        break;
      case 2:
        navigation.navigate(BLUETOOTH_SCREEN);
        break;
    }
  };
  const renderScene = () => {};
  return (
    <View style={styles.footer}>
      {routes.map((e, i) => (
        <TouchableOpacity
          onPress={indexChange(i)}
          key={e.key}
          style={styles.touchable}>
          <View style={styles.item}>
            <Icon
              style={{
                color: index === i ? '#fff' : 'rgba(255, 255, 255, 0.5)',
              }}
              name={e.icon}
              size={25}
            />
            <Text
              style={{
                color: index === i ? '#fff' : 'rgba(255, 255, 255, 0.5)',
                fontWeight: 'bold',
              }}>
              {e.title}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  footer: {
    width: '100%',
    height: 54,
    backgroundColor: '#0e3f94',
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    alignItems: 'center',
  },
  touchable: {
    flex: 1,
  },
  item: {
    flexDirection: 'column',
    alignItems: 'center',
  },
});
export default memo(Footer);
