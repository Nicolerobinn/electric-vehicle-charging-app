import React, {memo} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';

const ConfigurationsTopBox = ({text}) => (
  <View style={styles.topBox}>
    <Icon name="ev-station" size={100} />
    <Text style={styles.topBoxText}> {text} </Text>
  </View>
);

const styles = StyleSheet.create({
  topBox: {
    height: 190,
    flexDirection: 'column',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBoxText: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 18,
  },
});

export default memo(ConfigurationsTopBox);
