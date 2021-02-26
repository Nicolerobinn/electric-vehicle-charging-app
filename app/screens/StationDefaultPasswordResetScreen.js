import React, {memo, useState, useEffect} from 'react';

import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  Alert,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import Icon from 'react-native-vector-icons/dist/Feather';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import Background from '../components/Background';
import {setHomeStation} from '../core/asyncStorage';

const StationDefaultPasswordResetScreen = ({route, navigation}) => {
  const {station = {}} = route.params;
  const [defaultPassword, setDefaultPassword] = useState({
    value: '',
    error: '',
  });
  const [password, setPassword] = useState({value: 'password', error: ''});
  const save = () => {
    console.log('save');
    const change = () => {
      navigation.goBack(null);
    };
    setHomeStation(station, password, change);
  };
  return (
    <SafeAreaViewBox>
      <View style={{flex: 1}}>
        <Header navigation={navigation} />
        <ScrollView style={{flex: 1}}>
          <KeyboardAvoidingView
            style={styles.keyBoard}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ConfigurationsTopBox text="LOGIN STATION NAME" />
            <View style={styles.container}>
              <TextInput
                label="Default Password"
                returnKeyType="done"
                value={defaultPassword.value}
                onChangeText={(text) =>
                  setDefaultPassword({value: text, error: ''})
                }
                error={!!defaultPassword.error}
                errorText={defaultPassword.error}
                secureTextEntry
              />

              <TextInput
                label="New Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({value: text, error: ''})}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
              />
              <Button mode="contained" onPress={save}>
                Save
              </Button>
            </View>
          </KeyboardAvoidingView>
        </ScrollView>
      </View>
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
  keyBoard: {
    flex: 1,
    width: '100%',
  },
  container: {
    flex: 1,
    padding: 20,
    width: '100%',
    maxWidth: 340,
    alignSelf: 'center',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default memo(StationDefaultPasswordResetScreen);
