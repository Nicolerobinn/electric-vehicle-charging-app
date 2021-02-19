import React, {memo, useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Text} from 'react-native';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {List, Switch} from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import globalStyles from '../core/globalStyles';

const ConfigurationsScreen = ({route, navigation}) => {
  const {websocket} = route.params;
  const [state, setstate] = useState();
  const [isSwitchOn, setIsSwitchOn] = React.useState(false);

  const onToggleSwitch = () => setIsSwitchOn(!isSwitchOn);
  const saveChange = () => {
    console.log('save');
  };
  return (
    <SafeAreaView style={globalStyles.androidSafeArea}>
      <Header
        navigation={navigation}
        websocket={websocket}
        saveChange={saveChange}
      />
      <ConfigurationsTopBox />
      <View>
        <Text>Home station</Text>
        <List.Item
          title="Name"
          left={(props) => <List.Icon {...props} icon="folder" />}
          right={(props) => (
            <Text style={{marginTop: 10}}>Home station Name</Text>
          )}
        />
        <List.Item
          title="WiFi"
          description="Item description"
          left={(props) => <List.Icon {...props} icon="wifi" />}
          right={(props) => <List.Icon {...props} icon="right" />}
        />
        <Text>Access</Text>
        <List.Item
          title="Unrestricted"
          description="Item description"
          left={(props) => <List.Icon {...props} icon="folder" />}
          right={(props) => (
            <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
          )}
        />
        <List.Item
          title="Authentication"
          description="Item description"
          left={(props) => <List.Icon {...props} icon="folder" />}
          right={(props) => <List.Icon {...props} icon="right" />}
        />
        <List.Item
          title="Factory Reset"
          left={(props) => (
            <List.Icon {...props} icon="settings-backup-restore" />
          )}
        />
      </View>
      <Footer navigation={navigation} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  topBox: {
    height: 190,
    flexDirection: 'column',
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  topBoxText: {
    fontWeight: 'bold',
    marginTop: 5,
    fontSize: 18,
  },
});

export default memo(ConfigurationsScreen);
