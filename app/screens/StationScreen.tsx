import React, { memo, useState, useEffect } from 'react';
import { START, STOP, WAITING, CONNECTOR_LIST } from '../constants';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import { Platform, Linking, StyleSheet, View, Image, Alert } from 'react-native';
import StationBody from '../components/StationBody';
import { Text, Button, IconButton } from 'react-native-paper';
import { type StationInter } from '../typings/stationType'

import Header from '../components/Header';
import Footer from '../components/Footer';
import { arrayMapEqul } from '../core/utils';
import WebSocketClient from '../core/WebSocketClient';

import { REMOVE_FAVOUR_REQ, ADD_FAVOUR_REQ } from '../core/api';
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ParamListBase>;
const AUTHORIZING = 'Authorizing';
const AVAILABLE = 'Available';
// redux
import { useAppSelector } from '../store/redux-patch';

const StationScreen = ({ route, navigation }: Props) => {
  const { station, seationService } = route.params as {
    station: StationInter,
    seationService: boolean
  };
  const { token, userData, message } = useAppSelector((state) => state.user);
  const {
    favouriteStationList = [],
    permissionList,
    homeStationList = [],
  } = userData;

  const [isFavourite, setIsFavourite] = useState(false);
  const [buttonDsiabled, setButtonDsiabled] = useState(false);
  const [chargingStatusText, setChargingStatusText] = useState(AVAILABLE);
  const [configurationButtonType, setConfigurationButtonType] = useState(true);
  // options: 'Start Charging', 'Waiting', 'Stop Charging'
  const [chargingStatus, setChargingStatus] = useState(START);

  // check if current station is favorite or not
  useEffect(() => {
    // init check in componentDidMount
    if (arrayMapEqul(homeStationList, station)) {
      setConfigurationButtonType(false);
    }
    if (arrayMapEqul(favouriteStationList, station)) {
      setIsFavourite(true);
    }
  }, []);

  const favouriteToggleHandler = () => {
    // check if guess user (check user permission)
    if (permissionList.indexOf('MODIFY_FAVOURITES') !== -1) {
      const command = isFavourite ? REMOVE_FAVOUR_REQ : ADD_FAVOUR_REQ;
      const requestBody = {
        command: command,
        token: token,
        payload: {
          smpctNumber: station.smpctNumber,
          connectorList: station.connectorList,
        },
      };
      const response = WebSocketClient.instance?.sendMessage(requestBody);
      if (response?.status === 'success') {
        setIsFavourite(!isFavourite);
      } else {
        console.log('add/remove favourite error');
      }
    } else {
      Alert.alert(
        'Please create an account to do this action',
        'Please create an account to do this action',
        [{ text: 'Sign up', onPress: () => console.log('OK Pressed') }],
        { cancelable: false },
      );
    }
  };
  const getUrl = (latitude: string, longitude: string, label: string) => {
    const browser_url = `https://www.google.de/maps/@${latitude},${longitude}?q=${label}`;
    return Linking.openURL(browser_url);
  };
  const configurationClick = () => {
    // 密码校验
    // if (homeStationPasswordCompare(station)) {
    //   navigation.navigate('StationDefaultPasswordResetScreen', {
    //     station: station,
    //   });
    //   return;
    // }
    navigation.navigate('ConfigurationsScreen', { station: {} });
  };
  const getDirectionHandler = () => {
    // todo: get station latitude & longitude
    const latitude = '40.7127753';
    const longitude = '-74.0059728';
    const label = station.name;

    const url = Platform.select({
      ios: `maps:${latitude},${longitude}?q=${label}`,
      android: `geo:${latitude},${longitude}?q=${label}`,
    });
    if (!url) return
    Linking.canOpenURL(url).then((supported) => {
      return getUrl(latitude, longitude, label);
    });
  };

  const startChargingHandler = () => {
    if (buttonDsiabled) {
      return;
    }
    console.log('charging');
    // START, WAITING, STOP
    // need an API
    switch (chargingStatus) {
      case START:
        setChargingStatus(WAITING);
        setChargingStatusText(AUTHORIZING);
        break;
      case WAITING:
        setChargingStatus(STOP);
        break;
      case STOP:
        setChargingStatus(START);
        break;

      default:
        break;
    }
    setButtonDsiabled(true);
  };

  return (
    <SafeAreaViewBox>
      <Header />
      <View style={styles.stationHeader}>
        <View style={styles.stationContent}>
          <View style={styles.contentTitle}>
            <Text>{station.smpctNumber}</Text>
            <IconButton
              icon={isFavourite ? 'star' : 'star-outline'}
              size={20}
              onPress={favouriteToggleHandler}
            />
          </View>
          <Text
            style={{
              marginBottom: 5,
            }}>{`${station.addressLineOne} ${station.addressLineTwo} ${station.city} ${station.state} `}</Text>
          <Text>Max Power: 50.00kW</Text>
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.stationButton}
              icon="map-marker"
              mode="contained"
              uppercase={false}
              onPress={getDirectionHandler}>
              Directions
            </Button>
            <Button
              style={styles.stationButton}
              icon="account-cog"
              mode="outlined"
              // disabled={configurationButtonType}
              uppercase={false}
              onPress={configurationClick}>
              Configuration
            </Button>
          </View>
        </View>
        <View style={styles.stationHeaderRight}>
          {/* todo: change the color solid / empty  */}
          {!!station.connectorList?.length &&
            station.connectorList.map((str: string, index) => {
              if (CONNECTOR_LIST[str]) {
                return (
                  <View style={styles.connectorListBox} key={index}>
                    <Image
                      source={CONNECTOR_LIST[str].url}
                      style={styles.image}
                    />
                    <Text>{CONNECTOR_LIST[str].type}</Text>
                  </View>
                );
              }
            })}
        </View>
      </View>
      {/* 暂时不处理，优先级较低，app整体flex布局修改，  */}
      {!seationService ? (
        <StationBody />
      ) : (
        <View style={{ flex: 1 }} />
      )}

      <Footer />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  stationHeader: {
    height: 200,
    flexDirection: 'row',
    backgroundColor: 'lightblue',
  },
  stationHeaderRight: {
    paddingTop: 20,
    width: '20%',
  },
  stationContent: {
    padding: 20,
    width: '80%',
  },
  contentTitle: {
    height: 30,
    alignItems: 'center',
    textAlign: 'justify',
    flexDirection: 'row',
  },
  connectorListBox: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonWrapper: {
    marginTop: 30,
    flexDirection: 'row',
  },
  favouriteButton: {
    marginTop: '-20px',
  },
  stationButton: {
    marginRight: 10,
  },
  button: {
    marginTop: 20,
    paddingTop: 5,
    paddingBottom: 5,
    width: 200,
    borderRadius: 10,
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default memo(StationScreen);
