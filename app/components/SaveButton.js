import React, {memo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Button} from 'react-native-paper';
const SaveButton = (props) => {
  const {save} = props;
  return (
    <Button
      style={styles.saveButton}
      mode="contained"
      uppercase={false}
      onPress={() => save()}>
      Save
    </Button>
  );
};
const styles = StyleSheet.create({
  saveButton: {
    position: 'absolute',
  },
});

export default memo(SaveButton);
