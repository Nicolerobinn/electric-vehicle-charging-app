import React, {memo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import Item from './Items';
const ListingComponent = ({stations = [], navigation, propKkey}) => {
  return (
    <View style={styles.scene}>
      <ScrollView>
        {stations.length > 0 &&
          stations.map((station) => (
            <Item
              navigation={navigation}
              station={station}
              icon1="power-plug"
              icon2="power-plug-off"
              available={true}
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
