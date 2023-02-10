import React, { memo, useState, useRef, useEffect } from 'react';
import { StyleSheet } from 'react-native';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Search from '../components/Search';
import TouchListing from '../components/TouchListing';
import Listings from '../components/Listings';
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
type Props = StackScreenProps<ParamListBase>;

// redux
import { useSelector, useDispatch } from 'react-redux';
import * as Actions from '../store/Actions';
const HomeScreen = ({ navigation }: Props) => {
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
        displayGoBackButton={false}
      />
      <Search
        ref={childRef}
        navigation={navigation}
        searchChange={setSearchState}
      />

      {/* 根据visible切换对应状态 */}
      {/* 搜索列表 */}
      {searchState.visible && (
        <TouchListing
          list={searchState.station}
          onChange={setSearchState}
          navigation={navigation}
        />
      )}
      {/* home tab组件 */}
      {!searchState.visible && <Listings navigation={navigation} />}
      <Footer navigation={navigation} />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  header: {},
});

export default memo(HomeScreen);
