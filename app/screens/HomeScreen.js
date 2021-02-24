import React, {memo, useState, useRef, useEffect} from 'react';
import {StyleSheet, Dimensions, View, TouchableOpacity} from 'react-native';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Search from '../components/Search';
import {ListingComponent} from '../components/Listings';

import Listings from '../components/Listings';

// redux
import {useSelector, useDispatch} from 'react-redux';
import * as Actions from '../store/Actions';
const HomeScreen = ({route, navigation}) => {
  const qrCode = useSelector((state) => state.appData.qrCode);
  const dispatch = useDispatch();
  const [searchState, setSearchState] = useState({});
  const childRef = useRef();
  useEffect(() => {
    console.log(qrCode);
    if (qrCode) {
      childRef.current.search(qrCode);
      dispatch(Actions.setQRCode(''));
    }
  }, [qrCode]);
  return (
    <SafeAreaViewBox>
      <Header
        style={styles.header}
        navigation={navigation}
        displayGoBackButton={false}
        displaySearchBar={true}
      />
      <Search
        ref={childRef}
        navigation={navigation}
        searchChange={setSearchState}
      />

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
