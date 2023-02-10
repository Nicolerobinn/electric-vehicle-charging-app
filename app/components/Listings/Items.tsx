import React, { memo, useEffect, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { List, Text, Button, Divider } from 'react-native-paper';
import { useAppSelector } from '../../store/redux-patch';
import { connecterTypeChecker } from '../../core/utils';
import { GET_CONNECTOR_REQ, GET_CONNECTOR_RES } from '../../core/api';
import { writeRecentStationToAsyncStorage } from '../../core/asyncStorage';
import { useDeepCompareEffect } from 'ahooks';
import { useNavigation } from "@react-navigation/native";
import type { StationInter } from '../../typings/stationType'
import WebSocketClient from '../../core/WebSocketClient';

interface ItemRightProps {
  type: string
  seationService: boolean
  iconsState: string[]
  onPress: () => void
}
const ItemRight = ({ onPress, seationService, iconsState, type }: ItemRightProps) => {
  return (
    <View style={[styles.flexBox, styles.rightBox]}>
      <Text >{type}</Text>
      <View style={[styles.flexBox]}>
        {iconsState.map((e, i) => (
          <View key={i} style={[styles.circle, { backgroundColor: e }]} />
        ))}
      </View>
      <Button
        style={{
          borderRadius: 6,
        }}
        uppercase={false}
        mode="contained"
        onPress={onPress}>
        {seationService ? 'View' : 'Start'}
      </Button>
    </View>
  );
};
const Items = ({ station }: { station: StationInter }) => {
  const [iconsState, setIconsState] = useState(['grey', 'grey']);
  const [seationService, setSeationService] = useState(true);
  const { token, message } = useAppSelector((state) => state.user);
  const serialNumber = station.serialNumber || station.smpctNumber;
  const navigation = useNavigation();

  const type = connecterTypeChecker(station.connectorList);
  const stationName = `${serialNumber} \n${station.name} `;
  const address = `${station.addressLineOne} ${station.addressLineTwo} ${station.city} ${station.state} `;

  useDeepCompareEffect(() => {
    const { command = '', status = '', payload } = message;
    const { statusList = [], noService = false } = payload || {};
    if (command === GET_CONNECTOR_RES) {
      if (status === 'SUCCESS') {
        if (noService) {
          return;
        }
        const arr = statusList.map((e: string) => {
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
              return ''
          }
        });
        setSeationService(false);
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

    WebSocketClient.instance.sendMessage(requestBody);
  }, []);

  const handleStationNavigation = () => {
    // store current station to async storage
    writeRecentStationToAsyncStorage(station, serialNumber);
    return navigation.navigate('StationScreen' as never, {
      station: station,
      seationService: seationService,
    } as never);
  };

  return (
    <>
      <List.Item
        title={stationName}
        titleNumberOfLines={2}
        description={address}
        right={() => (
          <ItemRight
            onPress={handleStationNavigation}
            iconsState={iconsState}
            seationService={seationService}
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
