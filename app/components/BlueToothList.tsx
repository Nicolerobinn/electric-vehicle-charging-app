import React from 'react';
import { Button, Divider, List } from 'react-native-paper';
import { View, Text, StyleSheet } from 'react-native';
import { type BueTouchConnectionInter } from '../typings/stationType'

interface Props {
  arr: BueTouchConnectionInter[]
  buttonText: string
  boxTitle: string
  change: (blue: BueTouchConnectionInter) => () => void
}
const BlueToothList = ({ arr = [], buttonText, boxTitle, change }: Props) => {
  return (
    <>
      <Divider />
      <Text style={styles.title}>{boxTitle}</Text>
      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        {arr.map((e, i) => (
          <List.Item
            key={i}
            style={styles.item}
            title={e.name}
            right={() => (
              <Button
                style={styles.changeButton}
                mode="outlined"
                labelStyle={styles.changeButtonLabel}
                uppercase={false}
                onPress={change(e)}>
                {buttonText}
              </Button>
            )}
          />
        ))}
      </View>
    </>
  );
};
const styles = StyleSheet.create({
  title: {
    paddingLeft: 16,
    paddingTop: 16,
    color: 'gray',
  },
  changeButton: {
    height: 20,
    marginTop: 5,
    fontSize: 10,
  },
  changeButtonLabel: {
    fontSize: 10,
    marginVertical: 3,
    marginHorizontal: 10,
  },
  item: { paddingBottom: 0, paddingTop: 0, paddingLeft: 25 },
});
export default BlueToothList;
