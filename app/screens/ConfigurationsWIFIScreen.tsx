import React, { memo, useState, useEffect } from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import { List, Divider } from 'react-native-paper';
import AndroidTextAlert from '../components/AndroidTextAlert';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Icon from 'react-native-vector-icons/dist/Feather';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import type { BueTouchConnectionInter } from '../typings/stationType'
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ParamListBase>;
interface ListBoxProps {
  arr: BueTouchConnectionInter[]
  buttonText?: string
  boxTitle: string
  change: (blue: BueTouchConnectionInter) => () => void
}
const PROMPT = 'Please enter password for wifi:';
const NetworksArr: BueTouchConnectionInter[] = [
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
const CurrentConnectionArr: BueTouchConnectionInter[] = [
  {
    title: 'Phone two',
    id: '1',
  },
];
const ListBox = ({ arr = [], boxTitle, change }: ListBoxProps) => {
  return (
    <>
      <Divider />
      <Text style={styles.title}>{boxTitle}</Text>
      <View style={{ paddingTop: 10, paddingBottom: 10 }}>
        {arr.map((e, i) => (
          <List.Item
            key={i}
            style={styles.item}
            title={e.title}
            onPress={change(e)}
            right={(props) => (
              <View
                style={{ flexDirection: 'row', paddingTop: 10, paddingRight: 4 }}>
                {e.lock && <Icon name="lock" style={{ marginRight: 4 }} />}
                <Icon name="wifi" />
              </View>
            )}
          />
        ))}
      </View>
    </>
  );
};
const ConfigurationsBlueToochScreen = ({ navigation }: Props) => {
  const [wifiState, setWifiState] = useState<{
    title: string
  }>({ title: '' });
  const [visible, setVisible] = useState(false);
  useEffect(() => { }, []);
  const hideDialog = () => setVisible(false);
  const unConnection = (i: BueTouchConnectionInter) => () => {
    console.log('wifi-unConnection', i);
  };
  // todo: 连接wifi
  const connectionWIFI = (e: BueTouchConnectionInter) => { };
  // todo: 发送请求 校验密码是否正确 通过 useEffect监听 response
  const passwordCheck = (text: string) => {
    console.log('wifiState', wifiState);
    console.log(text);
  };
  const wifiLockAlert = (e: BueTouchConnectionInter) => {
    Alert.prompt('', `${PROMPT} ${e.title}`, (text) => {
      passwordCheck(text);
    });
  };
  const connection = (e: BueTouchConnectionInter) => () => {
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
  const androidAlertChange = (text: string) => {
    passwordCheck(text);
    hideDialog();
  };
  return (
    <SafeAreaViewBox>
      <Header />
      <ConfigurationsTopBox />
      <AndroidTextAlert
        visible={visible}
        hideDialog={hideDialog}
        handleChange={() => androidAlertChange}
        title={`${PROMPT} ${wifiState.title}`}
      />
      <ScrollView style={{ flex: 1 }}>
        <List.Item
          style={styles.titleItem}
          title="WiFi"
          left={(props) => <Icon size={18} style={styles.right} name="wifi" />}
        />
        <ListBox
          boxTitle="CurrentConnection"
          arr={CurrentConnectionArr}
          change={unConnection}
        />
        <ListBox boxTitle="Networks" arr={NetworksArr} change={connection} />
      </ScrollView>
      <Footer />
    </SafeAreaViewBox>
  );
};

const styles = StyleSheet.create({
  title: {
    paddingLeft: 16,
    paddingTop: 16,
    color: 'gray',
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
  item: { paddingBottom: 0, paddingTop: 0, paddingLeft: 25 },
});

export default memo(ConfigurationsBlueToochScreen);
