import React, { memo } from 'react';
import { SafeAreaView, View } from 'react-native';
// UI components
// for IOS adaptation security zone
const SafeAreaViewBox = ({ children }: { children: React.ReactNode }) => {
  return (
    <View
      style={{
        flex: 1,
      }}>
      <SafeAreaView />
      <SafeAreaView style={{ flex: 1 }}>{children}</SafeAreaView>
      <SafeAreaView style={{ backgroundColor: '#0e3f94' }} />
    </View>
  );
};
export default memo(SafeAreaViewBox);
