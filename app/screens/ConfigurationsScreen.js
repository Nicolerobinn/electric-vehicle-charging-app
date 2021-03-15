import React, {memo, useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Switch,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {useSelector} from 'react-redux';
import {List, Divider} from 'react-native-paper';
import AndroidTextAlert from '../components/AndroidTextAlert';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ConfigurationsScreen = ({route, navigation}) => {
  const [state, setstate] = useState();
  const [visible, setVisible] = useState(false);
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const webscoketClient = useSelector((state) => state.appData.webscoketClient);
  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const hideDialog = () => setVisible(false);
  const saveChange = () => {
    console.log('save');
  };
  const bluetoothClick = () => {
    navigation.navigate('ConfigurationsBlueToochScreen', {arr: {}});
  };
  const wifiClick = () => {
    navigation.navigate('ConfigurationsWIFIScreen', {arr: {}});
  };
  const nameChange = (text) => {
    console.log('station name', text);
  };
  const nameAlert = () => {
    Alert.prompt('', 'Plaese give this station a name', (text) => {
      nameChange(text);
    });
  };
  const nameAlertShow = () => {
    if (Platform.OS === 'android') {
      setVisible(true);
      return;
    }
    // IOS alert
    nameAlert();
    return;
  };
  const androidAlertChange = (text) => {
    nameChange(text);
    hideDialog();
  };
  return (
    <SafeAreaViewBox>
      <AndroidTextAlert
        visible={visible}
        hideDialog={hideDialog}
        handleChange={() => androidAlertChange}
        title={'Plaese give this station a name'}
      />
      <Header navigation={navigation} saveChange={saveChange} />
      <ConfigurationsTopBox />
      <ScrollView style={{flex: 1}}>
        <Text style={styles.title}>Home Station</Text>
        <List.Item
          style={styles.item}
          title="Name"
          onPress={nameAlertShow}
          left={(props) => <List.Icon {...props} icon="folder" />}
          right={(props) => (
            <Text style={{marginTop: 10}}>Home station Name</Text>
          )}
        />
        <List.Item
          style={styles.item}
          title="Configuration Password "
          left={(props) => <List.Icon {...props} icon="wifi" />}
          right={(props) => (
            <Icon size={20} style={styles.right} name="arrow-forward-ios" />
          )}
        />
        <List.Item
          style={styles.item}
          title="Authentication"
          titleStyle={{fontSize: 14, color: 'gray'}}
        />
        <Divider />
        <List.Item
          style={styles.item}
          title="WiFi"
          onPress={wifiClick}
          left={(props) => <List.Icon {...props} icon="wifi" />}
          right={(props) => (
            <Icon size={20} style={styles.right} name="arrow-forward-ios" />
          )}
        />
        <List.Item
          style={styles.item}
          title="Authentication"
          titleStyle={{fontSize: 14, color: 'gray'}}
        />
        <Divider />
        <Text style={styles.title}>Access</Text>
        <List.Item
          style={styles.item}
          title="Unrestricted"
          titleStyle={{color: isSwitchOn ? 'gray' : 'black'}}
          left={(props) => (
            <List.Icon
              {...props}
              color={isSwitchOn ? 'gray' : 'black'}
              icon="folder"
            />
          )}
          right={(props) => (
            <Switch
              style={{transform: [{scaleX: 0.8}, {scaleY: 0.8}]}}
              trackColor={{false: '#767577', true: '#81b0ff'}}
              thumbColor={isSwitchOn ? '#f5dd4b' : '#f4f3f4'}
              ios_backgroundColor="#3e3e3e"
              onValueChange={onToggleSwitch}
              value={isSwitchOn}
            />
          )}
        />
        <List.Item
          style={styles.item}
          title="Authentication"
          titleStyle={{color: !isSwitchOn ? 'gray' : 'black'}}
          onPress={isSwitchOn && bluetoothClick}
          left={(props) => (
            <List.Icon
              {...props}
              color={!isSwitchOn ? 'gray' : 'black'}
              icon="folder"
            />
          )}
          right={(props) => (
            <Icon size={20} style={styles.right} name="arrow-forward-ios" />
          )}
        />
        <List.Item
          style={styles.item}
          title="Authentication"
          titleStyle={{fontSize: 14, color: 'gray'}}
        />
        <Divider />
        <List.Item
          style={styles.item}
          title="Factory Reset"
          left={(props) => (
            <Icon size={25} style={styles.left} name="build-circle" />
          )}
        />
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingLeft: 20,
    paddingTop: 20,
    color: 'gray',
  },
  right: {
    top: 8,
    color: 'gray',
  },
  left: {
    top: 4,
    marginRight: 22,
    marginLeft: 8,
  },
  item: {paddingBottom: 0, paddingTop: 0},
});

export default memo(ConfigurationsScreen);
