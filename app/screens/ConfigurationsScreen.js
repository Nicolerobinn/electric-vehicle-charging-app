import React, {memo, useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Text, Switch} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {List, Colors} from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import globalStyles from '../core/globalStyles';

const ConfigurationsScreen = ({route, navigation}) => {
  const {websocket} = route.params;
  const [state, setstate] = useState();
  const [isSwitchOn, setIsSwitchOn] = useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const saveChange = () => {
    console.log('save');
  };
  const bluetoothClick = () => {
    navigation.navigate('ConfigurationsBlueToochScreen', {arr: {}});
  };
  const wifiClick = () => {
    navigation.navigate('ConfigurationsWIFIScreen', {arr: {}});
  };
  return (
    <SafeAreaView style={globalStyles.androidSafeArea}>
      <Header
        displaySaveConfigurations
        navigation={navigation}
        websocket={websocket}
        saveChange={saveChange}
      />
      <ConfigurationsTopBox />
      <View>
        <Text style={styles.title}>Home Station</Text>
        <List.Item
          style={styles.item}
          title="Name"
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
        <View style={styles.line} />
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
        <View style={styles.line} />
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
        <View style={styles.line} />
        <List.Item
          style={styles.item}
          title="Factory Reset"
          left={(props) => (
            <Icon size={25} style={styles.left} name="build-circle" />
          )}
        />
      </View>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingLeft: 20,
    paddingTop: 20,
    color: 'gray',
  },
  line: {
    backgroundColor: 'black',
    height: 0.5,
    width: '100%',
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
