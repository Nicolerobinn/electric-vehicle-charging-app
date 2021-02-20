import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {List, Text, Button, Divider, IconButton} from 'react-native-paper';

import {connecterTypeChecker} from '../../core/utils';
import {writeRecentStationToAsyncStorage} from '../../core/asyncStorage';

const Items = ({navigation, station, icon1, icon2, available}) => {
  //todo: after steven confirm, we either use  station.smpctNumber or station.serialNumber
  const serialNumber = station.serialNumber || station.smpctNumber;

  const type = connecterTypeChecker(station.connectorList);
  const stationName = `${station.name} ${station.serialNumber}`;
  const address = `${station.addressLineOne} ${station.addressLineTwo} ${station.city} ${station.state} `;

  const buttonMode = available ? 'contained' : 'text';
  const buttonText = available ? 'Charge' : 'View';

  useEffect(() => {
    // get station information
    // todo: check station status and passed to station details page
    // const requestBody = {
    //   command: 'GetConnectorStatusListV1Request', // Required
    //   token: token,
    //   payload: {
    //     smpctNumber: serialNumber,
    //   },
    // };
    // websocketCall(websocket, requestBody, false);
  }, []);

  const handleStationNavigation = () => {
    // store current station to async storage
    writeRecentStationToAsyncStorage(station, serialNumber);
    return navigation.navigate('StationScreen', {
      station: station,
    });
  };

  return (
    <React.Fragment>
      <List.Item
        title={stationName}
        titleNumberOfLines={2}
        description={address}
        left={(props) => <Text style={styles.margin}>{type}</Text>}
        right={(props) => (
          <React.Fragment>
            <View style={styles.circle} />
            <View style={styles.circle} />
            <Button
              style={styles.button}
              mode={buttonMode}
              onPress={handleStationNavigation}>
              {buttonText}
            </Button>
          </React.Fragment>
        )}
      />
      <Divider />
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  margin: {
    marginTop: 20,
  },
  icon: {
    marginTop: 25,
    width: 5,
    height: 5,
  },
  button: {
    marginTop: 10,
    height: 30,
    width: 100,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    marginRight: 5,
    marginTop: 20,
    backgroundColor: 'green',
  },
});

export default Items;
