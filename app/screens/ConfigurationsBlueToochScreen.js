import React, {memo, useState, useEffect} from 'react';
import {StyleSheet, ScrollView, View, Text} from 'react-native';
import {Button} from 'react-native-paper';
import Icon from 'react-native-vector-icons/dist/Feather';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import {List} from 'react-native-paper';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';

const AutherArr = [
  {
    title: 'iPhone',
    id: '1',
  },
  {
    title: 'My-iPhone',
    id: '2',
  },
];
const AvaliableArr = [
  {
    title: 'Phone two',
    id: '1',
  },
  {
    title: 'spot-2',
    id: '2',
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
            right={(props) => (
              <Button
                style={styles.changeButton}
                mode="outlined"
                labelStyle={styles.changeButtonLabel}
                uppercase={false}
                onPress={change(i)}>
                {buttonText}
              </Button>
            )}
          />
        ))}
      </View>
    </>
  );
};
const ConfigurationsBlueToochScreen = ({route, navigation}) => {
  const {websocket} = route.params;
  const [state, setstate] = useState();
  const remove = (i) => () => {
    console.log('remove', i);
  };
  const add = (i) => () => {
    console.log('add', i);
  };
  const arr = [];
  const arr2 = [];
  return (
    <SafeAreaViewBox>
      <Header navigation={navigation} websocket={websocket} />
      <ConfigurationsTopBox />
      <ScrollView style={{flex: 1}}>
        <List.Item
          style={styles.titleItem}
          title="Bluetooth"
          left={(props) => (
            <Icon size={18} style={styles.right} name="bluetooth" />
          )}
        />
        <ListBox
          buttonText="remove"
          boxTitle="Authenticated Devices"
          arr={AutherArr}
          change={remove}
        />
        <ListBox
          boxTitle="Avaliable Devices"
          arr={AvaliableArr}
          buttonText="add"
          change={add}
        />
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
