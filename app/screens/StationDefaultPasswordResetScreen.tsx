import React, { memo, useState } from 'react';

import {
  StyleSheet,
  View,
  ScrollView,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import SafeAreaViewBox from '../components/SafeAreaViewBox';
import ConfigurationsTopBox from '../components/ConfigurationsTopBox';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { type StationInter } from '../typings/stationType'
import { setHomeStation } from '../core/asyncStorage';
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ParamListBase>;

const StationDefaultPasswordResetScreen = ({ route, navigation }: Props) => {
  const { station } = route.params as {
    station: StationInter
  };
  const [defaultPassword, setDefaultPassword] = useState({
    value: '',
    error: '',
  });

  const [password, setPassword] = useState({ value: '', error: '' });
  const save = async () => {
    await setHomeStation(station, password.value);
    navigation.goBack();
  };
  return (
    <SafeAreaViewBox>
      <View style={{ flex: 1 }}>
        <Header />
        <ScrollView style={{ flex: 1 }}>
          <KeyboardAvoidingView
            style={styles.keyBoard}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
            <ConfigurationsTopBox text="LOGIN STATION NAME" />
            <View style={styles.container}>
              <TextInput
                label="please enter original password"
                returnKeyType="done"
                value={defaultPassword.value}
                onChangeText={(text) =>
                  setDefaultPassword({ value: text, error: '' })
                }
                error={!!defaultPassword.error}
                errorText={defaultPassword.error}
                secureTextEntry
              />

              <TextInput
                label="please enter new password"
                returnKeyType="done"
                value={password.value}
                onChangeText={(text) => setPassword({ value: text, error: '' })}
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
