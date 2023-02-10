import React, { memo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { theme } from '../core/theme';
import { useNavigation } from "@react-navigation/native";

import DropdownMenu from './DropdownMenu';
import BackButton from './BackButton';

const Header = ({ displayGoBackButton = true }: {
  displayGoBackButton?: boolean
}) => {
  const navigation = useNavigation();


  const handleGoBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.top}>
      {displayGoBackButton && <BackButton goBack={handleGoBack} />}
      <Text style={styles.center}>EV-NRGY</Text>
      <DropdownMenu />
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
