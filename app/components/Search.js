import React, {memo, useState} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {theme} from '../core/theme';
import {Searchbar, Button, IconButton} from 'react-native-paper';
import {FIND_STATION_RES, FIND_STATION_REQ} from '../core/api';
import {useDeepCompareEffect} from '../core/hooks';
// redux
import {useSelector} from 'react-redux';

// import QRScanner from '../QRScanner';

// const QRScreenComponent = () => {
//   return (<View>
//     <QRScanner />
//   </View>)
// }

const Search = ({navigation, searchChange}) => {
  const appData = useSelector((state) => state.appData);
  const {webscoketClient, connected, token, message} = appData || {};
  const [searchQuery, setSearchQuery] = useState('3140000000');

  useDeepCompareEffect(() => {
    const {status, command, payload} = message || {};
    if (status === 'SUCCESS' && command === FIND_STATION_RES) {
      searchChange({
        visible: true,
        station: [payload],
      });
    }
  }, [message]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
    searchChange({
      visible: false,
    });
  };
  const handleQRScan = () => {};

  const searchHandler = () => {
    const requestBody = {
      command: FIND_STATION_REQ,
      token: token,
      payload: {
        smpctNumber: searchQuery,
      },
    };
    webscoketClient.sendMessage(requestBody, connected);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search station #"
          onChangeText={onChangeSearch}
          value={searchQuery}
          style={styles.searchBar}
        />
        <TouchableOpacity style={styles.button}>
          <IconButton
            size={30}
            icon="map-search"
            onPress={searchHandler}
            color="#fff"
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleQRScan} style={styles.QRScan}>
          <Button
            icon="qrcode-scan"
            style={styles.icon}
            color={theme.colors.primary}
          />
          <Text style={styles.label}>Scan QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    paddingTop: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchBar: {flex: 4},
  QRScan: {alignItems: 'center', justifyContent: 'center'},
  icon: {
    width: 20,
    height: 20,
    paddingLeft: 20,
    color: theme.colors.primary,
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
});

export default memo(Search);
