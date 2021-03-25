import React, {memo, useState, useRef, useEffect} from 'react';
import {StyleSheet, ScrollView} from 'react-native';
import BlueToothList from '../components/BlueToothList';
import {useSelector} from 'react-redux';
import Icon from 'react-native-vector-icons/dist/Feather';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import {List} from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import BlueTouchClient from '../core/BlueTouchClient';

const ConfigurationsBlueTouchScreen = ({route, navigation}) => {
  const appData = useSelector((state) => state.appData);
  const {connectedPeripheralsList, peripheralsList} = appData;

  // 移除蓝牙
  const remove = (peripheral) => () => {
    BlueTouchClient.instance?.removeBlueConnect(peripheral);
  };
  // 添加蓝牙
  const add = (peripheral) => () => {
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
      <Header navigation={navigation} />
      <ConfigurationsTopBox text="HOME STATIONS" />
      <ScrollView style={{flex: 1}}>
        <List.Item
          style={styles.titleItem}
          title="Bluetooth"
          left={(props) => (
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
      <Footer navigation={navigation} />
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
  item: {paddingBottom: 0, paddingTop: 0, paddingLeft: 25},
});

export default memo(ConfigurationsBlueTouchScreen);
