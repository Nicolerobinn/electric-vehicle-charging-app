import React, {memo} from 'react';
import {StyleSheet} from 'react-native';

import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Search from '../components/Search';

import Listings from '../components/Listings';

const HomeScreen = ({route, navigation}) => {
  return (
    <SafeAreaViewBox>
      <Header
        style={styles.header}
        navigation={navigation}
        displayGoBackButton={false}
        displaySearchBar={true}
      />
      <Search navigation={navigation} />
      <Listings navigation={navigation} />
      <Footer navigation={navigation} />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  header: {},
});

export default memo(HomeScreen);
