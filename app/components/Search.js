import React, {memo, useState, useEffect} from 'react';
import {StyleSheet, View, TouchableOpacity, Text} from 'react-native';
import {theme} from '../core/theme';
import {Searchbar, Button, IconButton} from 'react-native-paper';

// redux
import {useSelector} from 'react-redux';

// import QRScanner from '../QRScanner';

// const QRScreenComponent = () => {
//   return (<View>
//     <QRScanner />
//   </View>)
// }

const Search = ({navigation}) => {
  const webscoketClient = useSelector((state) => state.appData.webscoketClient);
  // todo: remove it for testing
  // const [searchQuery, setSearchQuery] = useState('');
  const [searchQuery, setSearchQuery] = useState('3140000000');
  const token = useSelector((state) => state.appData.token);

  // listen to onMessage change
  const message = useSelector((state) => state.appData.message);

  useEffect(() => {
    if (
      message?.status === 'SUCCESS' &&
      message?.command === 'FindStationV1Response'
    ) {
      const messageData = message.payload;
      navigation.navigate('StationScreen', {station: messageData});
    } else if (message?.status === 'ERROR') {
      // some error
    }
  }, [message]);

  const onChangeSearch = (query) => {
    setSearchQuery(query);
  };
  const handleQRScan = () => {};

  const searchHandler = () => {
    const requestBody = {
      command: 'FindStationV1Request', // Required
      token: token,
      payload: {
        smpctNumber: searchQuery,
      },
    };
    webscoketClient.sendMessage(requestBody);
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
