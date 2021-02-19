import React, {memo} from 'react';
import {View, Text, StyleSheet, SafeAreaView} from 'react-native';
import globalStyles from '../core/globalStyles';

import Header from '../components/Header';
import Footer from '../components/Footer';

import Listings from '../components/Listings';

const HomeScreen = ({route, navigation}) => {
  const {websocket} = route.params;

  return (
    <SafeAreaView style={globalStyles.androidSafeArea}>
      <Header
        style={styles.header}
        navigation={navigation}
        websocket={websocket}
        displayGoBackButton={false}
        displaySearchBar={true}
      />
      <Listings navigation={navigation} />
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {},
});

export default memo(HomeScreen);
