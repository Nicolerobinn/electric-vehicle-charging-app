import React, {memo, useEffect, useState} from 'react';
import {View, StyleSheet, Dimensions, Text, ScrollView} from 'react-native';
import {TabView, SceneMap} from 'react-native-tab-view';
import Item from './Items';
import ListingComponent from './ListingComponent';
import {readRecentStationListFromAsyncStorage} from '../../core/asyncStorage';
// redux
import {useSelector} from 'react-redux';

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
const RecentList = ({navigation}) => {
  const [recentStationList, setRecentStationList] = useState([]);
  useEffect(() => {
    readRecentStationListFromAsyncStorage(setRecentStationList);
  }, []);
  return (
    <ListingComponent
      navigation={navigation}
      stations={recentStationList}
      propKkey="recent"
    />
  );
};
const ListingsScreen = ({navigation}) => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutesArr] = useState(arr);
  const userData = useSelector((state) => state.appData.userData);
  const {favouriteStationList, homeStationList = []} = userData || {};
  useEffect(() => {
    if (homeStationList.length === 0) {
      setRoutesArr(arrTwo);
    } else {
      setRoutesArr(arr);
    }
  }, [homeStationList.length]);

  // TODO: 修改SceneMap 关闭error
  const renderScene = SceneMap({
    recent: () => <RecentList navigation={navigation} />,
    favorites: () => (
      <ListingComponent
        navigation={navigation}
        stations={favouriteStationList}
        propKkey="favorites"
      />
    ),
    home: () => (
      <ListingComponent
        navigation={navigation}
        stations={homeStationList}
        propKkey="home"
      />
    ),
  });
  return (
    <TabView
      lazy={true}
      removeClippedSubviews={true}
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
