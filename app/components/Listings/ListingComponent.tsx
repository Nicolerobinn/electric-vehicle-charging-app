import React, { memo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import type { StationInter } from '../../typings/stationType'

import Item from './Items';
const ListingComponent = ({ stations = [], propKkey }: {
  stations: StationInter[]
  propKkey: string
}) => {
  return (
    <View style={styles.scene}>
      <ScrollView>
        {stations.length > 0 &&
          stations.map((station) => (
            <Item
              station={station}
              key={`${propKkey}_${station.smpctNumber}`}
            />
          ))}
      </ScrollView>
    </View>
  );
};
// todo: deal with the height
const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
export default memo(ListingComponent);
