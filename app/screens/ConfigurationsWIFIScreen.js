import React, {memo, useState, useEffect} from 'react';
import {StyleSheet, View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {List} from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';

const ConfigurationsBlueToochScreen = ({route, navigation}) => {
  const {websocket} = route.params;
  const [state, setstate] = useState();
  const wifiClick = (i) => {
    console.log('wifiClick', i);
  };
  const arr = [];
  return (
    <SafeAreaViewBox>
      <Header navigation={navigation} websocket={websocket} />
      <ConfigurationsTopBox />
      <View>
        <Text style={styles.title}>WiFi</Text>
        <View style={styles.line} />
        <Text style={styles.title}> Networks </Text>
        {arr.map((e, i) => (
          <List.Item
            style={styles.item}
            title={e}
            onPress={wifiClick(e)}
            right={(props) => (
              <View>
                <List.Icon {...props} icon="wifi" />
                <List.Icon {...props} icon="wifi" />
              </View>
            )}
          />
        ))}
      </View>
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
  item: {paddingBottom: 0, paddingTop: 0},
});

export default memo(ConfigurationsBlueToochScreen);
