import React, {memo, useState} from 'react';
import {StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Search from '../components/Search';
import {ListingComponent} from '../components/Listings';

import Listings from '../components/Listings';

const HomeScreen = ({route, navigation}) => {
  const [searchState, setSearchState] = useState({});
  return (
    <SafeAreaViewBox>
      <Header
        style={styles.header}
        navigation={navigation}
        displayGoBackButton={false}
        displaySearchBar={true}
      />
      <Search navigation={navigation} searchChange={setSearchState} />

      {searchState.visible && (
        <TouchableOpacity
          onPress={(e) => setSearchState({})}
          style={[{width: Dimensions.get('window').width, flex: 1}]}>
          <View style={[{width: '100%', flex: 1}]}>
            <ListingComponent
              navigation={navigation}
              stations={searchState.station}
              propKkey="search"
            />
          </View>
        </TouchableOpacity>
      )}
      {!searchState.visible && <Listings navigation={navigation} />}
      <Footer navigation={navigation} />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  header: {},
});

export default memo(HomeScreen);
