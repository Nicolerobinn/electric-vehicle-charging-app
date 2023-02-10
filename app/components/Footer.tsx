import React, { useState, memo, useEffect } from 'react';
import { Linking, StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import { useAppSelector } from '../store/redux-patch';
import { useNavigation } from "@react-navigation/native";

const HOME_SCREEN = 'HomeScreen';
const BLUETOOTH_SCREEN = 'ConfigurationsBlueToochScreen';
const ROUTER = [
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
]
const Footer = () => {
  const { homeStationList = [] } = useAppSelector((state) => state.station);
  const [index, setIndex] = useState<null | number>(0);
  const navigation = useNavigation();

  const { currentRoute } = useAppSelector((state) => state.user);
  const [routes, setRoutes] = useState(ROUTER);
  useEffect(() => {
    switch (currentRoute) {
      case HOME_SCREEN:
        setIndex(0);
        break;
      case BLUETOOTH_SCREEN:
        setIndex(2);
        break;
      default:
        setIndex(null);
        break;
    }
  }, [currentRoute]);
  useEffect(() => {
    if (homeStationList.length > 0) {
      setRoutes(ROUTER);
    }
  }, [homeStationList.length]);
  const indexChange = (i: number) => () => {
    if (i === 1) {
      Linking.openURL('https://dev.evnrgy.com/');
      return;
    }
    setIndex(i);
    switch (i) {
      case 0:
        navigation.navigate(HOME_SCREEN as never);
        break;
      case 2:
        navigation.navigate(BLUETOOTH_SCREEN as never);
        break;
    }
  };
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
