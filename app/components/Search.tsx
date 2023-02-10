import React, { memo, useState, useImperativeHandle, forwardRef } from 'react';
import { StyleSheet, View, TouchableOpacity, Text } from 'react-native';
import { theme } from '../core/theme';
import { Searchbar, Button, IconButton } from 'react-native-paper';
import { FIND_STATION_RES, FIND_STATION_REQ } from '../core/api';
import { useDeepCompareEffect } from 'ahooks';
import WebSocketClient from '../core/WebSocketClient';
import { useNavigation } from "@react-navigation/native";

// redux
import { useAppSelector } from '../store/redux-patch';
export type forwardRefType = {
  search: (str: string) => void;
};
const Search = ({ searchChange }: {
  searchChange: (obj: { visible: boolean; station: string[] }) => void
}, ref?: React.Ref<forwardRefType>) => {
  const { token, message } = useAppSelector((state) => state.user);
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('3140000000');
  useDeepCompareEffect(() => {
    const { status, command, payload } = message || {};
    if (status === 'SUCCESS' && command === FIND_STATION_RES) {
      searchChange({
        visible: true,
        station: [payload],
      });
    }
  }, [message]);
  // 此处注意useImperativeHandle方法的的第一个参数是目标元素的ref引用
  const onChangeSearch = (query: string) => {
    setSearchQuery(query);
    searchHandler();
  };
  useImperativeHandle(ref, () => ({
    search: onChangeSearch,
  }));
  const handleQRScan = () => {
    navigation.navigate('QRScannerScreen' as never, { arr: {} } as never);
  };

  const searchHandler = () => {
    const requestBody = {
      command: FIND_STATION_REQ,
      token: token,
      payload: {
        smpctNumber: searchQuery,
      },
    };
    WebSocketClient.instance.sendMessage(requestBody);
  };

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <Searchbar
          placeholder="Search station #"
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
        />
        <TouchableOpacity style={styles.button}>
          <IconButton
            size={30}
            icon="map-search"
            onPress={searchHandler}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleQRScan} style={styles.QRScan}>
          <Button
            icon="qrcode-scan"
            style={styles.icon}
          ><></></Button>
          <Text  >Scan QR</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    padding: 20,
    paddingTop: 10,
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  searchBar: { flex: 4 },
  QRScan: { alignItems: 'center', justifyContent: 'center' },
  icon: {
    width: 20,
    height: 20,
    paddingLeft: 20,
    color: theme.colors.primary,
  },
  text: {
    fontSize: 26,
    fontWeight: 'bold',
    paddingVertical: 10,
  },
  button: {
    backgroundColor: theme.colors.primary,
  },
});

export default memo(forwardRef(Search));
