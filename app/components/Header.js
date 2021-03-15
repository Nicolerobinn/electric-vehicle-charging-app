import React, {memo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../core/theme';
import DropdownMenu from './DropdownMenu';
import BackButton from '../components/BackButton';

const Header = ({navigation, displayGoBackButton = true, saveChange}) => {
  const handleGoBack = () => {
    navigation.goBack(null);
  };

  return (
    <View style={styles.top}>
      {displayGoBackButton && <BackButton goBack={handleGoBack} />}
      <Text style={styles.center}>EV-NRGY</Text>
      <DropdownMenu navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  top: {
    position: 'relative',
  },
  center: {
    textAlign: 'center',
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});

export default memo(Header);
