import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Header from '../components/Header';
import Footer from '../components/Footer';

import Listings from '../components/Listings';

const HomeScreen = ({route, navigation}) => {
  const {websocket} = route.params;

  return (
    <SafeAreaViewBox>
      <Header
        style={styles.header}
        navigation={navigation}
        websocket={websocket}
        displayGoBackButton={false}
        displaySearchBar={true}
      />
      <Listings navigation={navigation} />
      <Footer navigation={navigation} />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  header: {},
});

export default memo(HomeScreen);
