import React, {memo, useState} from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {theme} from '../core/theme';
import DropdownMenu from './DropdownMenu';
import BackButton from '../components/BackButton';
import Search from './Search';

const Header = ({
  websocket,
  navigation,
  displayGoBackButton = true,
  displaySearchBar = false,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const onChangeSearch = (query) => setSearchQuery(query);

  const handleGoBack = () => {
    console.log('go back');
    navigation.goBack(null);
  };

  return (
    <React.Fragment>
      <View style={styles.top}>
        {displayGoBackButton && <BackButton goBack={handleGoBack} />}
        <Text style={styles.text}>EV-NRGY</Text>
      </View>
      <DropdownMenu navigation={navigation} websocket={websocket} />
      {displaySearchBar && (
        <Search navigation={navigation} websocket={websocket} />
      )}
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  top: {
    alignItems: 'center',
  },

  text: {
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
});

export default memo(Header);
