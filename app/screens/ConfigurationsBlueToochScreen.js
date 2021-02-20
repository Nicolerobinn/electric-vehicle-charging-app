import React, {memo, useState, useEffect} from 'react';
import {StyleSheet, SafeAreaView, View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/MaterialIcons';
import {List} from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import globalStyles from '../core/globalStyles';

const ConfigurationsBlueToochScreen = ({route, navigation}) => {
  const {websocket} = route.params;
  const [state, setstate] = useState();
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  const remove = (i) => {
    console.log('remove', i);
  };
  const arr = [];
  const arr2 = [];
  return (
    <SafeAreaView style={globalStyles.androidSafeArea}>
      <Header navigation={navigation} websocket={websocket} />
      <ConfigurationsTopBox />
      <View>
        <Text style={styles.title}>Bluetooth</Text>
        <View style={styles.line} />
        <Text style={styles.title}>Authenticated Devices</Text>
        {arr.map((e, i) => (
          <List.Item
            style={styles.item}
            title="Authenticated Devices"
            right={(props) => (
              <Button
                style={styles.removeButton}
                mode="contained"
                uppercase={false}
                onPress={remove(i)}>
                remove
              </Button>
            )}
          />
        ))}
        <View style={styles.line} />
        <Text style={styles.title}>Avaliable Devices</Text>
        {arr2.map((e, i) => (
          <List.Item style={styles.item} title={e} />
        ))}
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
