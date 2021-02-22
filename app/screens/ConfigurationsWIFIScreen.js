import React, {memo, useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  TextInput,
} from 'react-native';
import {Button, List, Dialog, Portal, Paragraph} from 'react-native-paper';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Icon from 'react-native-vector-icons/dist/Feather';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';

const PROMPT = 'Please enter password for wifi:';
const NetworksArr = [
  {
    title: 'spot-1',
    id: '1',
  },
  {
    title: 'spot-2',
    id: '2',
    lock: true,
  },
];
const CurrentConnectionArr = [
  {
    title: 'Phone two',
    id: '1',
  },
];
const ListBox = ({arr = [], buttonText, boxTitle, change}) => {
  return (
    <>
      <View style={styles.line} />
      <Text style={styles.title}>{boxTitle}</Text>
      <View style={{paddingTop: 10, paddingBottom: 10}}>
        {arr.map((e, i) => (
          <List.Item
            key={i}
            style={styles.item}
            title={e.title}
            onPress={change(e)}
            right={(props) => (
              <View
                style={{flexDirection: 'row', paddingTop: 10, paddingRight: 4}}>
                {e.lock && <Icon name="lock" style={{marginRight: 4}} />}
                <Icon name="wifi" />
              </View>
            )}
          />
        ))}
      </View>
    </>
  );
};
const AndroidAlert = ({visible, hideDialog, state, passwordChange}) => {
  const [inputText, setInputText] = useState('');
  return (
    <Portal>
      <Dialog visible={visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph>{`${PROMPT} ${state.title}`}</Paragraph>
          <View style={{borderBottomWidth: 1, paddingTop: 20}}>
            <TextInput
              style={styles.input}
              onChangeText={(text) => setInputText(text)}
            />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={() => hideDialog()}>Cancel</Button>
          <Button
            onPress={() => {
              passwordChange(inputText);
              hideDialog();
            }}>
            Ok
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
const ConfigurationsBlueToochScreen = ({route, navigation}) => {
  const [wifiState, setWifiState] = useState({});
  const [visible, setVisible] = useState(false);
  useEffect(() => {}, []);
  const hideDialog = () => setVisible(false);
  const unConnection = (i) => () => {
    console.log('wifi-unConnection', i);
  };
  // todo: 连接wifi
  const connectionWIFI = (e) => {};
  // todo: 发送请求 校验密码是否正确 通过 useEffect监听 response
  const passwordCheck = (text) => {
    console.log('wifiState', wifiState);
    console.log(text);
  };
  const wifiLockAlert = (e) => {
    Alert.prompt('', `${PROMPT} ${e.title}`, (text) => {
      passwordCheck(text);
    });
  };
  const connection = (e) => () => {
    setWifiState(e);
    if (e.lock) {
      if (Platform.OS === 'android') {
        setVisible(true);
        return;
      }
      // IOS alert
      wifiLockAlert(e);
      return;
    }
    connectionWIFI(e);
  };
  const arr = [];
  return (
    <SafeAreaViewBox>
      <Header navigation={navigation} />
      <ConfigurationsTopBox />
      <AndroidAlert
        visible={visible}
        hideDialog={hideDialog}
        passwordChange={passwordCheck}
        state={wifiState}
      />
      <ScrollView style={{flex: 1}}>
        <List.Item
          style={styles.titleItem}
          title="WiFi"
          left={(props) => <Icon size={18} style={styles.right} name="wifi" />}
        />
        <ListBox
          lock
          boxTitle="CurrentConnection"
          arr={CurrentConnectionArr}
          change={unConnection}
        />
        <ListBox boxTitle="Networks" arr={NetworksArr} change={connection} />
      </ScrollView>
      <Footer navigation={navigation} />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingLeft: 16,
    paddingTop: 16,
    color: 'gray',
  },
  line: {
    backgroundColor: 'black',
    height: 0.5,
    width: '100%',
  },
  right: {
    top: 6,
    color: 'gray',
  },
  left: {
    top: 4,
    marginRight: 22,
    marginLeft: 8,
  },
  changeButton: {
    height: 20,
    marginTop: 5,
    fontSize: 10,
  },
  changeButtonLabel: {
    fontSize: 10,
    marginVertical: 3,
    marginHorizontal: 10,
  },
  titleItem: {
    paddingBottom: 0,
    paddingTop: 0,
  },
  item: {paddingBottom: 0, paddingTop: 0, paddingLeft: 25},
});

export default memo(ConfigurationsBlueToochScreen);
