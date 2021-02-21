import React, {memo} from 'react';
import {SafeAreaView, View} from 'react-native';
// UI components
// for IOS adaptation security zone
const SafeAreaViewBox = ({children}) => {
  return (
    <View style={{flex: 1}}>
      <SafeAreaView />
      {children}
    </View>
  );
};
export default memo(SafeAreaViewBox);
