import React, {memo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../core/theme';
import DropdownMenu from './DropdownMenu';
import BackButton from '../components/BackButton';
import SaveButton from './SaveButton';

const Header = ({
  navigation,
  displayGoBackButton = true,
  displaySaveConfigurations = false,
  saveChange,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  const handleGoBack = () => {
    navigation.goBack(null);
  };

  return (
    <View style={styles.box}>
      <View style={styles.top}>
        {displayGoBackButton && <BackButton goBack={handleGoBack} />}
        <Text style={styles.center}>EV-NRGY</Text>
        {displaySaveConfigurations ? (
          <SaveButton save={saveChange} />
        ) : (
          <DropdownMenu navigation={navigation} />
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  box: {},
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
