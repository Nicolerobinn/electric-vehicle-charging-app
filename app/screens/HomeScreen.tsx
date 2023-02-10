import React, { memo, useState, useRef, useEffect } from 'react';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Search, { type forwardRefType } from '../components/Search';
import TouchListing from '../components/TouchListing';
import Listings from '../components/Listings';

// redux
import { useAppSelector, useAppDispatch } from '../store/redux-patch';
import { setQRCode } from '../store/slice/userSlice';
const HomeScreen = () => {
  const { qrCode } = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const [searchState, setSearchState] = useState<{
    visible: boolean
    station: any[]
  }>({ visible: false, station: [] });
  const childRef = useRef<forwardRefType | null>(null);
  useEffect(() => {
    if (qrCode && childRef.current) {
      childRef.current.search(qrCode);
      dispatch(setQRCode(''));
    }
  }, [qrCode]);
  return (
    <SafeAreaViewBox>
      <Header
        displayGoBackButton={false}
      />
      <Search
        ref={childRef}
        searchChange={setSearchState}
      />

      {/* 根据visible切换对应状态 */}
      {/* 搜索列表 */}
      {searchState.visible && (
        <TouchListing
          list={searchState.station}
          onChange={setSearchState}
        />
      )}
      {/* home tab组件 */}
      {!searchState.visible && <Listings />}
      <Footer />
    </SafeAreaViewBox>
  );
};

export default memo(HomeScreen);
