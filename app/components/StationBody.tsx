import React, { memo, useState, useEffect } from 'react';
import { START, STOP, WAITING } from '../constants';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import { StyleSheet, View } from 'react-native';
import Chart from './Chart';
import { Text, Button, ActivityIndicator } from 'react-native-paper';

const AUTHORIZING = 'Authorizing';
const AVAILABLE = 'Available';
// redux
import { useSelector } from 'react-redux';

const StationBody = () => {
  const appData = useSelector((state) => state.appData);
  const { token, userData, message } = appData || {};

  const [buttonDsiabled, setButtonDsiabled] = useState(false);
  const [chargingStatusText, setChargingStatusText] = useState(AVAILABLE);
  // options: 'Start Charging', 'Waiting', 'Stop Charging'
  const [chargingStatus, setChargingStatus] = useState(START);

  useEffect(() => { }, []);

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
    <View style={styles.stationBody}>
      <ActivityIndicator
        animating={chargingStatus === WAITING}
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
      <Text
        style={{
          fontSize: 16,
          fontWeight: 'bold',
          color: 'rgba(255, 255, 255, 1.0)',
        }}>
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
  );
};

const styles = StyleSheet.create({
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
});

export default memo(StationBody);
