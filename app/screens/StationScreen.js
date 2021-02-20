import React, {memo, useState, useEffect} from 'react';
import {START, STOP, WAITING, CONNECTOR_LIST} from '../constants';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {
  Platform,
  Linking,
  StyleSheet,
  SafeAreaView,
  View,
  Image,
  Alert,
} from 'react-native';
import Chart from '../components/Chart';
import {
  Text,
  Button,
  IconButton,
  ActivityIndicator,
  Colors,
} from 'react-native-paper';
import globalStyles from '../core/globalStyles';
import {websocketCall, connecterTypeChecker} from '../core/utils';

import Header from '../components/Header';
import Footer from '../components/Footer';
const AUTHORIZING = 'Authorizing';
const AVAILABLE = 'Available';
// redux
import {useSelector} from 'react-redux';

const StationScreen = ({route, navigation}) => {
  const {websocket, station = {}} = route.params;
  console.log(station.connectorList);
  const token = useSelector((state) => state.appData.token);
  const userData = useSelector((state) => state.appData.userData);
  const {favouriteStationList = [], permissionList} = userData;

  const [isFavourite, setIsFavourite] = useState(false);
  const [buttonDsiabled, setButtonDsiabled] = useState(false);
  const [chargingStatusText, setChargingStatusText] = useState(AVAILABLE);
  // options: 'Start Charging', 'Waiting', 'Stop Charging'
  const [chargingStatus, setChargingStatus] = useState(START);
  const message = useSelector((state) => state.appData.message);

  useEffect(() => {
    // get station details from message
    if (
      message?.status === 'SUCCESS' &&
      message?.command === 'FindStationV1Response'
    ) {
      const stationData = message.payload;
      // setStation(stationData);
    } else if (message?.status === 'ERROR') {
      // some error
    }
  }, [message]);

  // check if current station is favorite or not

  favouriteStationList.forEach((obj) => {
    if (obj?.smpctNumber === station.serialNumber) {
      setIsFavourite(true);
    }
  });

  const favouriteToggleHandler = () => {
    // check if guess user (check user permission)

    if (!permissionList.includes('MODIFY_FAVOURITES')) {
      const command = isFavourite
        ? 'RemoveFavouriteV1Request'
        : 'AddFavouriteV1Request';
      const requestBody = {
        command: command,
        token: token,
        payload: {
          smpctNumber: station.serialNumber,
        },
      };
      const response = websocketCall(websocket, requestBody, false);
      if (response?.status === 'success') {
        setIsFavourite(!isFavourite);
      } else {
        console.log('add/remove favourite error');
      }
    } else {
      // todo: test in device alert user
      alert('Please create an account to do this action');
      Alert.alert(
        'Please create an account to do this action',
        'Please create an account to do this action',
        [{text: 'Sign up', onPress: () => console.log('OK Pressed')}],
        {cancelable: false},
      );
    }
  };
  const getUrl = (latitude, longitude, label) => {
    const browser_url = `https://www.google.de/maps/@${latitude},${longitude}?q=${label}`;
    return Linking.openURL(browser_url);
  };
  const configurationClick = () => {
    navigation.navigate('ConfigurationsScreen', {station: {}});
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
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        // todo: test on real device
        const url = Platform.select({
          ios: `maps:${latitude},${longitude}?q=${label}`,
          android: `geo:${latitude},${longitude}?q=${label}`,
        });
        // return Linking.openURL(url);
        return getUrl(latitude, longitude, label);
      } else {
        return getUrl(latitude, longitude, label);
      }
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
    <SafeAreaView style={globalStyles.androidSafeArea}>
      <Header
        style={styles.header}
        navigation={navigation}
        websocket={websocket}
      />
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
              uppercase={false}
              onPress={configurationClick}>
              Configuration
            </Button>
          </View>
        </View>
        <View style={styles.stationHeaderRight}>
          {/* todo: change the color solid / empty  */}
          {station.connectorList.map((str, index) => {
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
      <View style={styles.stationBody}>
        <ActivityIndicator
          animating={chargingStatus === WAITING}
          color={Colors.red800}
        />
        {chargingStatus === STOP && <Chart />}
        {chargingStatus === START && <Icon name="ev-station" size={100} />}
        <Text
          style={{
            marginTop: 12,
            marginBottom: 12,
            fontWeight: 'bold',
            color: 'gray',
          }}>
          {chargingStatusText}
        </Text>
        <Text style={{fontSize: 16, fontWeight: 'bold', color: 'balck'}}>
          $1.00/hr
        </Text>
        <Button
          disabled={buttonDsiabled}
          style={styles.button}
          mode="contained"
          uppercase={false}
          onPress={startChargingHandler}>
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
  stationBody: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
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

export default StationScreen;
