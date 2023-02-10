import React, { memo } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { theme } from '../core/theme';

interface Props {
  text: string
  touchText: string
  onChange: () => void
}
const BottomTouchView = ({ text, touchText, onChange }: Props) => (
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
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
});

export default memo(BottomTouchView);
