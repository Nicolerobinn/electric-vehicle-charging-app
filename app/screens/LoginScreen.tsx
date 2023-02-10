import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import {
  LOGIN_REQ,
  LOGIN_RES,
  SKIP_LOGIN_REQ,
  SKIP_LOGIN_RES,
} from '../core/api';
import { useDeepCompareEffect } from 'ahooks';
import Background from '../components/Background';
import Logo from '../components/Logo';
import BottomTouchView from '../components/BottomTouchView';
import Title from '../components/Title';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { emailValidator, passwordValidator } from '../core/utils';
import WebSocketClient from '../core/WebSocketClient';
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
// redux
import { useAppDispatch, useAppSelector } from '../store/redux-patch';

import { saveMessage } from '../store/slice/userSlice'
type Props = StackScreenProps<ParamListBase>;

const LoginScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const { message } = useAppSelector((state) => state.user);

  // todo: cleanup
  const [email, setEmail] = useState({
    value: 'owner@company1.com',
    error: '',
  });
  const [password, setPassword] = useState({ value: 'password', error: '' });
  const [generalError, setGeneralError] = useState('');

  useDeepCompareEffect(() => {
    const { command = '', status = '', message: info } = message;
    if (command === LOGIN_RES || command === SKIP_LOGIN_RES) {
      if (status === 'SUCCESS') {
        dispatch(saveMessage());
        navigation.navigate('HomeScreen' as never);
      } else if (status === 'ERROR') {
        setGeneralError(info);
      }
    }
  }, [message]);
  const handleLoginSubmit = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      return;
    }
    const requestBody = {
      command: LOGIN_REQ, // Required
      payload: {
        email: email.value, // Required
        password: password.value, // Required
      },
    };
    WebSocketClient.instance?.sendMessage(requestBody);
  };

  const handleSkipLoginSubmit = () => {
    const requestBody = {
      command: SKIP_LOGIN_REQ, // Required
      payload: {},
    };
    WebSocketClient.instance?.sendMessage(requestBody);
  };

  return (
    <Background>
      <Logo />

      <Title>Please login</Title>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text: string) => setEmail({ value: text, error: '' })}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoComplete="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({ value: text, error: '' })}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text  >Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={handleLoginSubmit}>
        Login
      </Button>

      <Button mode="text" onPress={handleSkipLoginSubmit}>
        Skip Login
      </Button>

      <View >
        <Text style={styles.error}>{generalError}</Text>
      </View>
      <BottomTouchView
        onChange={() => navigation.navigate('RegisterScreen')}
        text="Don’t have an account?"
        touchText="Sign up"
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  error: {
    fontWeight: 'bold'
  },
});

export default memo(LoginScreen);
