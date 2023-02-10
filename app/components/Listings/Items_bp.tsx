import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { theme } from '../../core/theme';
import { Button } from 'react-native-paper';
const Item = () => {
  // todo: replace
  const time = '111';
  const iconName = 'qrcode-scan';
  const temp = '2222-scan';
  return (
    <View style={styles.list_row}>
      <Text style={styles.place}>Place</Text>
      <Text style={styles.list_row_time}>{time}</Text>
      <Button icon={iconName}><></></Button>
      <Text style={styles.list_row_temp}>{temp}</Text>
      <Text style={styles.description}>description</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  v_container: {
    flex: 1,
    padding: 8,
    flexDirection: 'column', // main axis
    justifyContent: 'center', // main axis
    alignItems: 'center', // cross axis
    backgroundColor: theme.colors.primary,
  },
  separator: {
    alignSelf: 'stretch',
    backgroundColor: theme.colors.primary,
    height: 1,
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    marginBottom: 10,
  },
  place: {
    paddingTop: 20,
    paddingBottom: 20,
    color: theme.colors.primary,
    fontSize: 35,
  },
  description: {
    color: theme.colors.primary,
    fontSize: 14,
  },
  current_temp: {
    color: theme.colors.primary,
    fontSize: 45,
  },
  list_container: {
    marginTop: 14,
    alignSelf: 'stretch',
  },
  list_row: {
    flexDirection: 'row',
    paddingLeft: 16,
    paddingRight: 16,
    paddingBottom: 12,
  },
  list_row_time: { flex: 1 },
  list_row_temp: { paddingLeft: 12 },
});

export default Item;
