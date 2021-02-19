import React, { memo, useState, useEffect } from 'react';
import {
  Platform,
  Linking,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import Chart from '../components/Chart';


import { Text, Button, IconButton } from 'react-native-paper';
import globalStyles from '../core/globalStyles';
import { websocketCall } from '../core/utils';

import Header from '../components/Header';
import Footer from '../components/Footer';

// redux
import { useSelector } from 'react-redux';

const StationScreen = ({ route, navigation }) => {
  const { websocket, serialNumber, station } = route.params;
  const token = useSelector(state => state.appData.token);

  const userData = useSelector(state => state.appData.userData);
  const { favouriteStationList } = userData;

  // const station = {
  //   smpctNumber: '03140000000', // Required
  //   addressLineOne: '1234', // Required
  //   addressLineTwo: '1234', // Optional
  //   city: '1234', // Required
  //   connectorList: [], // Required
  //   country: 'Canada', // Required
  //   name: 'SMPCT Charger #1', // Required
  //   postalCode: '1234', // Required
  //   state: 'British Columbia', // Required
  // };
  const [isFavourite, setIsFavourite] = useState(false);
  // options: 'Start Charging', 'Waiting', 'Stop Charging'
  const [chargingStatus, setChargingStatus] = useState("Start Charging");
  const message = useSelector(state => state.appData.message);


  useEffect(() => {
    // get station details from message
    if (
      message?.status === 'SUCCESS' &&
      message?.command === 'FindStationV1Response'
    ) {
      const stationData = message.payload;
      setStation(stationData);
    } else if (message?.status === 'ERROR') {
      // some error
    }
  }, [message]);

  // check if current station is favorite or not

  favouriteStationList.forEach(station => {
    if (
      station?.smpctNumber === serialNumber 
    ) {
      setIsFavourite(true);
    }
  });

  const favouriteToggleHandler = () => {
    // check if guess user (check user permission)

    if (!userData.permissionList.includes('MODIFY_FAVOURITES')) {
      const requestBody = {
        command: isFavourite ? 'RemoveFavouriteV1Request' : 'AddFavouriteV1Request',
        token: token,
        payload: {
          smpctNumber: serialNumber,
        },
      };
      const response = websocketCall(websocket, requestBody, false);
      if (response?.status === 'success') {
        setIsFavourite(!isFavourite);
      }
      else{
        console.log('add/remove favourite error');
      }
    } else {
      // todo: test in device alert user 
      alert("Please create an account to do this action")
      Alert.alert(
        'Please create an account to do this action',
        'Please create an account to do this action',
        [
          { text: 'Sign up', onPress: () => console.log('OK Pressed') }
        ],
        { cancelable: false }
      );
    }
    
  };

  const getDirectionHandler = () => {
    // todo: get station latitude & longitude
    const latitude = '40.7127753';
    const longitude = '-74.0059728';
    const label = station.name;

    const url = Platform.select({
      ios: 'maps:' + latitude + ',' + longitude + '?q=' + label,
      android: 'geo:' + latitude + ',' + longitude + '?q=' + label,
    });
    Linking.canOpenURL(url).then(supported => {
      if (supported) {
        // todo: test on real device
        const url = Platform.select({
          ios: "maps:" + latitude + "," + longitude + "?q=" + label,
          android: "geo:" + latitude + "," + longitude + "?q=" + label
        });
        // return Linking.openURL(url);
        const browser_url =
          'https://www.google.de/maps/@' +
          latitude +
          ',' +
          longitude +
          '?q=' +
          label;
        return Linking.openURL(browser_url);
      } else {
        const browser_url =
          'https://www.google.de/maps/@' +
          latitude +
          ',' +
          longitude +
          '?q=' +
          label;
        return Linking.openURL(browser_url);
      }
    });
  };

  const startChargingHandler = () => {
    console.log('charging');
    // 'Start Charging', 'Waiting', 'Stop Charging'
    // need an API
    if (chargingStatus==='Start Charging'){
      setChargingStatus('Waiting');
    } else if (chargingStatus==='Waiting'){
      setChargingStatus('Stop Charging');
    } else if (chargingStatus==='Stop Charging'){
      setChargingStatus('Start Charging');

    }
  }

  return (
    <SafeAreaView style={globalStyles.androidSafeArea}>
      <Header
        style={styles.header}
        navigation={navigation}
        websocket={websocket}
      />
      <View style={styles.stationHeader}>
        <View>
          <Text>{station.smpctNumber}</Text>
          <Text>{`${station.addressLineOne} ${station.addressLineTwo} ${station.city} ${station.state} `}</Text>
          <Text>Max Power: 50.00kW</Text>
          <View style={styles.buttonWrapper}>
            <Button
              style={styles.button}
              icon="map-marker"
              mode="contained"
              onPress={getDirectionHandler}
            >
              Direction
            </Button>
            <Button
              style={styles.button}
              icon="settings"
              mode="outlined"
              onPress={() => console.log('go to config page')}
            >
              Config
            </Button>
          </View>
        </View>
        <View style={styles.stationHeaderRight}>
          {/* todo: change the color solid / empty  */}
          <IconButton
            icon={isFavourite ? 'star' : 'star-outline'}
            size={20}
            onPress={favouriteToggleHandler}
          />
          <Image
            source={require('../assets/IEC_62196_AA.png')}
            style={styles.image}
          />
        </View>
      </View>
      <View style={styles.stationBody}>
        {chargingStatus==='Start Charging' && <Image
          source={require('../assets/plug_in.svg')}
          style={styles.image}
        />}
        {chargingStatus==='Waiting' && <ActivityIndicator size="large" color="#0e3f94" />}
        {chargingStatus==='Stop Charging' && <Chart/>}
        <Text>Max Power: 50.00kW</Text>
        <Text>$1.00/hr</Text>
        <Text>&nbsp;</Text>
        <Button
          style={styles.button}
          mode="contained"
          onPress={startChargingHandler}
        >
          {chargingStatus}
        </Button>
      </View>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  header: {},
  stationHeader: {
    flex: 1,
    flexDirection: 'row',
    padding: '30px',
    backgroundColor: 'lightblue',
  },
  stationHeaderRight: {
    paddingLeft: '45px',
  },
  stationBody: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonWrapper: {
    paddingTop: '30px',
    paddingRight: '20px',
    flexDirection: 'row',
  },
  favouriteButton: {
    marginTop: '-20px',
  },
  button: {
    width: '60%',
  },
  image: {
    width: 50,
    height: 50,
  },
});

export default StationScreen;
