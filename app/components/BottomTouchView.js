import React, {memo} from 'react';
import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import {theme} from '../core/theme';

const BottomTouchView = ({text, touchText, onChange}) => (
  <View style={styles.row}>
    <Text style={styles.label}>{text} </Text>
    <TouchableOpacity onPress={onChange}>
      <Text style={styles.link}>{touchText}</Text>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    marginTop: 4,
    justifyContent: 'center',
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(BottomTouchView);
