import React, { memo } from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import BlueToothList from '../components/BlueToothList';
import { useAppSelector } from '../store/redux-patch';
import Icon from 'react-native-vector-icons/dist/Feather';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import { List } from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlueTouchClient from '../core/BlueTouchClient';

import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ParamListBase>;
const ConfigurationsBlueTouchScreen = ({ navigation }: Props) => {
  const { connectedPeripheralsList, peripheralsList } = useAppSelector((state) => state.blueTouch);

  // 移除蓝牙
  const remove = (peripheral: any) => () => {
    BlueTouchClient.instance?.removeBlueConnect(peripheral);
  };
  // 添加蓝牙
  const add = (peripheral: any) => () => {
    BlueTouchClient.instance?.blueConnect(peripheral);
    console.log('Add peripheral', peripheral);
    return;
    navigation.navigate('StationDefaultPasswordResetScreen', {
      station: station,
    });
    console.log('add', station);
  };
  return (
    <SafeAreaViewBox>
      <Header />
      <ConfigurationsTopBox text="HOME STATIONS" />
      <ScrollView style={{ flex: 1 }}>
        <List.Item
          style={styles.titleItem}
          title="Bluetooth"
          left={() => (
            <Icon size={18} style={styles.right} name="bluetooth" />
          )}
        />
        <BlueToothList
          buttonText="Remove"
          boxTitle="Authenticated Devices"
          arr={connectedPeripheralsList}
          change={remove}
        />
        <BlueToothList
          boxTitle="Avaliable Devices"
          arr={peripheralsList}
          buttonText="Add"
          change={add}
        />
      </ScrollView>
      <Footer />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  right: {
    top: 6,
    color: 'gray',
  },
  titleItem: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  item: { paddingBottom: 0, paddingTop: 0, paddingLeft: 25 },
});

export default memo(ConfigurationsBlueTouchScreen);
