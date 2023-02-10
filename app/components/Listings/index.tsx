import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, Dimensions } from 'react-native';
import { TabView, type Route } from 'react-native-tab-view';
import ListingComponent from './ListingComponent';
import { readRecentStationListFromAsyncStorage } from '../../core/asyncStorage';
// redux
import { useAppSelector } from '../../store/redux-patch';

const initialLayout = { width: Dimensions.get('window').width };

const arr = [
  { key: 'recent', title: 'Recent' },
  { key: 'favorites', title: 'Favorites' },
  { key: 'home', title: 'Home' },
];
const arrTwo = [
  { key: 'recent', title: 'Recent' },
  { key: 'favorites', title: 'Favorites' },
];
const RecentList = () => {
  const [recentStationList, setRecentStationList] = useState([]);
  useEffect(() => {
    readRecentStationListFromAsyncStorage().then((list) => {
      setRecentStationList(list)
    })
  }, []);
  return (
    <ListingComponent
      stations={recentStationList}
      propKkey="recent"
    />
  );
};
const ListingsScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes, setRoutesArr] = useState(arr);
  const stationData = useAppSelector((state) => state.station);
  const { favouriteStationList, homeStationList = [] } = stationData || {};
  useEffect(() => {
    if (homeStationList.length === 0) {
      setRoutesArr(arrTwo);
    } else {
      setRoutesArr(arr);
    }
  }, [homeStationList.length]);

  const renderScene = ({ route }: { route: Route }) => {
    switch (route.key) {
      case 'recent':
        return <RecentList />;
      case 'favorites':
        return (
          <ListingComponent
            stations={favouriteStationList}
            propKkey="favorites"
          />
        );
      case 'home':
        return (
          <ListingComponent
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
      lazy={true}
      removeClippedSubviews={true}
      navigationState={{ index, routes }}
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
