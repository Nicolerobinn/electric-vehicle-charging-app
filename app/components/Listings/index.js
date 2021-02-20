import React, {memo, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text} from 'react-native';
import {TabView} from 'react-native-tab-view';
import Item from './Items';
import {getRecentStations} from '../../core/utils';
import AsyncStorage from '@react-native-community/async-storage';

// redux
import {useSelector} from 'react-redux';

const tabArr = [
  {key: 'recent', title: 'Recent'},
  {key: 'favorites', title: 'Favorites'},
  {key: 'home', title: 'Home'},
];
// fake station data
// const stations = [
//   {
//     id: 'fakeId_dont_care', // Required
//     addressLineOne: '1234 fake street', // Required
//     addressLineTwo: 'Suite 1651', // Optional
//     city: 'Burnaby', // Required
//     country: 'Canada', // Required
//     name: 'name', // Required
//     postalCode: '123453', // Required
//     serialNumber: '<11 1 digit number>', // Required
//     state: 'BC', // Required
//     connectorList: ['IEC_62196_TYPE_1'], // Required
//   },
//   {
//     id: 'fakeId_dont_care', // Required
//     addressLineOne: '1234 fake street', // Required
//     addressLineTwo: 'Suite 1651', // Optional
//     city: 'Burnaby', // Required
//     country: 'Canada', // Required
//     name: '<Name of the station>', // Required
//     postalCode: '123453', // Required
//     serialNumber: '<11 2 digit number>', // Required
//     state: 'BC', // Required
//     connectorList: ['IEC_62196__AA'], // Required
//   },
//   {
//     id: 'fakeId_dont_care', // Required
//     addressLineOne: '1234 fake street', // Required
//     addressLineTwo: 'Suite 1651', // Optional
//     city: 'Burnaby', // Required
//     country: 'Canada', // Required
//     name: '<Name of the station>', // Required
//     postalCode: '123453', // Required
//     serialNumber: '<11 3 digit number>', // Required
//     state: 'BC', // Required
//     connectorList: ['IEC_62196_CCS'], // Required
//   },
// ];

// todo: store recent station in AsyncStorage
const RecentRoute = ({stations = [], navigation}) => {
  return (
    <View style={styles.scene}>
      {/* <Text>123</Text> */}
      {stations.length > 0 &&
        stations.map((station) => {
          // todo: check available - connect to Get station status APIs

          //todo: after steven confirm, we either use  station.smpctNumber or station.serialNumber
          return (
            <Item
              navigation={navigation}
              station={station}
              icon1="power-plug"
              icon2="power-plug-off"
              available={true}
              key={`recent_${station.serialNumber}`}
            />
          );
        })}
    </View>
  );
};

const FavoritesRoute = ({navigation, stations = []}) => (
  <View style={styles.scene}>
    {stations.length > 0 &&
      stations.map((station) => {
        return (
          <Item
            navigation={navigation}
            station={station}
            icon1="power-plug"
            icon2="power-plug-off"
            available={true}
            key={`favourite_${station.serialNumber}`}
          />
        );
      })}
  </View>
);
const HomeRoute = () => (
  <View style={styles.scene}>
    <Text>Home stations will be listing here</Text>
  </View>
);

const initialLayout = {width: Dimensions.get('window').width};

const ListingsScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const userData = useSelector((state) => state.appData.userData);
  const {favouriteStationList, homeStationList} = userData;
  const [recentStationList, setRecentStationList] = useState([]);

  const [routes] = useState(tabArr);

  useEffect(() => {
    readRecentStationListFromAsyncStorage();
  }, []);

  // todo: cleanup this and move this in to utils
  const readRecentStationListFromAsyncStorage = async () => {
    const recentStationList = await AsyncStorage.getItem('recentStationList');
    console.log('recentStationList', recentStationList);
    if (recentStationList !== null) {
      setRecentStationList(JSON.parse(recentStationList));
    }

    // try {
    //   const recentStationList = await AsyncStorage.getItem("recentStationList")
    //   if (recentStationList !== null) {
    //     setRecentStationList(recentStationList);
    //   }
    // } catch (e) {
    //   alert('Failed to fetch the data from storage')
    // }
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'recent':
        return (
          <RecentRoute navigation={navigation} stations={recentStationList} />
        );
      case 'favorites':
        return (
          <FavoritesRoute
            navigation={navigation}
            stations={favouriteStationList}
          />
        );
      case 'home':
        return <HomeRoute navigation={navigation} stations={homeStationList} />;
      default:
        return null;
    }
  };
  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
      style={styles.wrapper}
    />
  );
};

// todo: deal with the height
const styles = StyleSheet.create({
  wrapper: {
    flex: 9,
  },
  scene: {
    flex: 1,
  },
});

export default memo(ListingsScreen);
