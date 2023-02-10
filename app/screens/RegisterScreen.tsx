import React, { memo, useState } from 'react';
import { useSelector } from 'react-redux';
import { View, Text, StyleSheet } from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Title from '../components/Title';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import { theme } from '../core/theme';
import { USER_REGISTRATION_REQ, USER_REGISTRATION_RES } from '../core/api';
import { useDeepCompareEffect } from 'ahooks';
import BottomTouchView from '../components/BottomTouchView';
import WebSocketClient from '../core/WebSocketClient';

import {
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  passwordMatch,
} from '../core/utils';
import type { ParamListBase } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';

type Props = StackScreenProps<ParamListBase>;


const RegisterScreen = ({ navigation }: Props) => {
  const message = useSelector((state) => state.appData.message);
  // todo: cleanup test data
  const [email, setEmail] = useState({
    value: 'zsyoscar@gmail.com',
    error: '',
  });
  const [password, setPassword] = useState({ value: 'abcabc', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({
    value: 'abcabc',
    error: '',
  });
  const [generalError, setGeneralError] = useState('');

  useDeepCompareEffect(() => {
    const { command = '', status = '', message: info } = message;
    if (command === USER_REGISTRATION_RES) {
      if (status === 'SUCCESS') {
        navigation.navigate('HomeScreen');
      } else if (status === 'ERROR') {
        setGeneralError(info);
      }
    }
  }, [message]);
  const handleSignupSubmit = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);
    const confirmPasswordError = confirmPasswordValidator(
      confirmPassword.value,
    );
    const passwordMatchError = passwordMatch(confirmPassword.value);

    // validation
    if (emailError || passwordError || passwordMatchError) {
      setEmail({ ...email, error: emailError });
      setPassword({ ...password, error: passwordError });
      setConfirmPassword({ ...confirmPassword, error: confirmPasswordError });
      return;
    }
    if (passwordMatchError) {
      setGeneralError(confirmPasswordError);
      return;
    }

    const requestBody = {
      command: USER_REGISTRATION_REQ, // Required
      payload: {
        email: email.value, // Required
        password: password.value, // Required
      },
    };
    WebSocketClient.instance?.sendMessage(requestBody);
  };

  return (
    <Background navigation={navigation}>
      <Logo />

      <Title>Create Account</Title>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({ value: text, error: '' })}
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

      <TextInput
        label="ConfirmPassword"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => setConfirmPassword({ value: text, error: '' })}
        error={!!confirmPassword.error}
        errorText={confirmPassword.error}
        secureTextEntry
      />

      <Button
        mode="contained"
        onPress={handleSignupSubmit}
        style={styles.button}>
        Sign Up
      </Button>

      <View style={styles.row}>
        <Text style={styles.error}>{generalError}</Text>
      </View>
      <BottomTouchView
        onChange={() => navigation.navigate('LoginScreen')}
        text="Already have an account? "
        touchText="Login"
      />
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
  },
  button: {
    marginTop: 24,
    backgroundColor: theme.colors.primary,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  error: {
    fontWeight: 'bold'
  },
});

export default memo(RegisterScreen);
