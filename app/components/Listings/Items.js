import React, {memo, useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {List, Text, Button, Divider, Colors} from 'react-native-paper';
import {useSelector} from 'react-redux';
import {connecterTypeChecker} from '../../core/utils';
import {GET_CONNECTOR_REQ, GET_CONNECTOR_RES} from '../../core/api';
import {writeRecentStationToAsyncStorage} from '../../core/asyncStorage';
import {useDeepCompareEffect} from '../../core/hooks';
const ItemRight = ({onPress, buttonMode, iconsState, available, type}) => {
  return (
    <View style={[styles.flexBox, styles.rightBox]}>
      <Text style={styles.margin}>{type}</Text>
      <View style={[styles.flexBox]}>
        {iconsState.map((e, i) => (
          <View key={i} style={[styles.circle, {backgroundColor: e}]} />
        ))}
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
  const appData = useSelector((state) => state.appData);
  const {webscoketClient, token, message, connected} = appData || {};
  const serialNumber = station.serialNumber || station.smpctNumber;

  const type = connecterTypeChecker(station.connectorList);
  const stationName = `${serialNumber} \n${station.name} `;
  const address = `${station.addressLineOne} ${station.addressLineTwo} ${station.city} ${station.state} `;

  const buttonMode = available ? 'contained' : 'text';
  const buttonText = available ? 'Charge' : 'View';
  const [iconsState, setIconsState] = useState(['grey', 'grey']);
  useDeepCompareEffect(() => {
    const {command = '', status = '', payload, message: info} = message;
    const {statusList = [], noService = false} = payload || {};
    if (command === GET_CONNECTOR_RES) {
      if (status === 'SUCCESS') {
        if (noService) {
          return;
        }
        const arr = statusList.map((e, i) => {
          switch (e) {
            case 'Available':
            case 'Finishing':
              return 'green';
            case 'Preparing':
            case 'Charging':
            case 'SuspendedEVSE':
            case 'SuspendedEV':
              return 'blue';
            case 'Unavailable':
            case 'Faulted':
              return 'black';
            default:
              break;
          }
        });
        setIconsState(arr);
      } else if (status === 'ERROR') {
      }
    }
  }, [message]);
  useEffect(() => {
    const requestBody = {
      command: GET_CONNECTOR_REQ, // Required
      token: token,
      payload: {
        smpctNumber: serialNumber,
      },
    };
    console.log(requestBody);
    webscoketClient.sendMessage(requestBody, connected);
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
            iconsState={iconsState}
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
  },
});

export default memo(Items);
