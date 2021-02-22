import React, {useEffect} from 'react';
import {StyleSheet, View} from 'react-native';
import {List, Text, Button, Divider, Colors} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {connecterTypeChecker} from '../../core/utils';
import {writeRecentStationToAsyncStorage} from '../../core/asyncStorage';
const ItemRight = ({onPress, buttonMode, available, type}) => {
  return (
    <View style={[styles.flexBox, styles.rightBox]}>
      <Text style={styles.margin}>{type}</Text>
      <View style={[styles.flexBox]}>
        <View style={styles.circle} />
        <View style={styles.circle} />
      </View>
      <Button
        style={{
          backgroundColor: available ? Colors.blue800 : 'gray',
          borderRadius: 6,
        }}
        uppercase={false}
        mode={buttonMode}
        onPress={onPress}>
        Start
      </Button>
    </View>
  );
};
const Items = ({navigation, station, available}) => {
  const webscoketClient = useSelector((state) => state.appData.webscoketClient);
  //todo: after steven confirm, we either use  station.smpctNumber or station.serialNumber
  const serialNumber = station.serialNumber || station.smpctNumber;

  const type = connecterTypeChecker(station.connectorList);
  const stationName = `${serialNumber} \n${station.name} `;
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
    // webscoketClient.sendMessage(requestBody, false);
  }, []);

  const handleStationNavigation = () => {
    // store current station to async storage
    writeRecentStationToAsyncStorage(station, serialNumber);
    return navigation.navigate('StationScreen', {
      station: station,
    });
  };

  return (
    <>
      <List.Item
        title={stationName}
        titleNumberOfLines={2}
        description={address}
        right={(props) => (
          <ItemRight
            onPress={handleStationNavigation}
            buttonMode={buttonMode}
            available={available}
            type={type}
          />
        )}
      />
      <Divider />
    </>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    justifyContent: 'center',
  },
  rightBox: {
    width: 200,
    justifyContent: 'space-around',
  },
  flexBox: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    marginTop: 25,
    width: 5,
    height: 5,
  },
  circle: {
    width: 10,
    height: 10,
    borderRadius: 10 / 2,
    marginRight: 5,
    backgroundColor: 'green',
  },
});

export default Items;
