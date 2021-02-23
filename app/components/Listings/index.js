import React, {memo, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, ScrollView} from 'react-native';
import {TabView} from 'react-native-tab-view';
import Item from './Items';
import {getRecentStations} from '../../core/utils';
import AsyncStorage from '@react-native-community/async-storage';

// redux
import {useSelector} from 'react-redux';

export const ListingComponent = ({stations = [], navigation, propKkey}) => {
  return (
    <View style={styles.scene}>
      <ScrollView>
        {stations.length > 0 &&
          stations.map((station) => (
            <Item
              navigation={navigation}
              station={station}
              icon1="power-plug"
              icon2="power-plug-off"
              available={true}
              key={`${propKkey}_${station.smpctNumber}`}
            />
          ))}
      </ScrollView>
    </View>
  );
};
const initialLayout = {width: Dimensions.get('window').width};

const arr = [
  {key: 'recent', title: 'Recent'},
  {key: 'favorites', title: 'Favorites'},
  {key: 'home', title: 'Home'},
];
const arrTwo = [
  {key: 'recent', title: 'Recent'},
  {key: 'favorites', title: 'Favorites'},
];
const ListingsScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutesArr] = useState(arr);
  const userData = useSelector((state) => state.appData.userData);
  const {favouriteStationList, homeStationList = []} = userData || {};
  const [recentStationList, setRecentStationList] = useState([]);
  useEffect(() => {
    readRecentStationListFromAsyncStorage();
  }, []);
  useEffect(() => {
    if (homeStationList.length === 0) {
      setRoutesArr(arrTwo);
    } else {
      setRoutesArr(arr);
    }
  }, [homeStationList.length]);
  // todo: cleanup this and move this in to utils
  const readRecentStationListFromAsyncStorage = async () => {
    const recentStationList = await AsyncStorage.getItem('recentStationList');
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
          <ListingComponent
            navigation={navigation}
            stations={recentStationList}
            propKkey="recent"
          />
        );
      case 'favorites':
        return (
          <ListingComponent
            navigation={navigation}
            stations={favouriteStationList}
            propKkey="favorites"
          />
        );
      case 'home':
        return (
          <ListingComponent
            navigation={navigation}
            stations={homeStationList}
            propKkey="home"
          />
        );
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
  wrapper: {},
  scene: {
    flex: 1,
  },
});

export default memo(ListingsScreen);
