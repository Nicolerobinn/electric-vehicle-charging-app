import React, {memo, useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
import {
  LOGIN_REQ,
  LOGIN_RES,
  SKIP_LOGIN_REQ,
  SKIP_LOGIN_RES,
} from '../core/api';
import {useDeepCompareEffect} from '../core/hooks';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Title from '../components/Title';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import {theme} from '../core/theme';
import {emailValidator, passwordValidator, websocketCall} from '../core/utils';

// redux
import {useSelector, useDispatch} from 'react-redux';
import * as Actions from '../store/Actions';

const LoginScreen = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {websocket} = route.params;
  const message = useSelector((state) => state.appData.message) || {};

  useDeepCompareEffect(() => {
    const {command = '', status = '', message: info} = message;
    if (command === LOGIN_RES || command === SKIP_LOGIN_RES) {
      if (status === 'SUCCESS') {
        navigation.navigate('HomeScreen');
        dispatch(Actions.saveMessage({}));
      } else if (status === 'ERROR') {
        setGeneralError(info);
      }
    }
  }, [message]);

  // todo: cleanup
  const [email, setEmail] = useState({
    value: 'owner@company1.com',
    error: '',
  });
  const [password, setPassword] = useState({value: 'password', error: ''});
  const [generalError, setGeneralError] = useState('');

  const handleLoginSubmit = () => {
    const emailError = emailValidator(email.value);
    const passwordError = passwordValidator(password.value);

    if (emailError || passwordError) {
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      return;
    }
    const requestBody = {
      command: LOGIN_REQ, // Required
      payload: {
        email: email.value, // Required
        password: password.value, // Required
      },
    };

    websocketCall(websocket, requestBody, false);
  };

  const handleSkipLoginSubmit = () => {
    const requestBody = {
      command: SKIP_LOGIN_REQ, // Required
      payload: {},
    };

    websocketCall(websocket, requestBody, false);
  };

  return (
    <Background>
      <Logo />

      <Title>Please login</Title>

      <TextInput
        label="Email"
        returnKeyType="next"
        value={email.value}
        onChangeText={(text) => setEmail({value: text, error: ''})}
        error={!!email.error}
        errorText={email.error}
        autoCapitalize="none"
        autoCompleteType="email"
        textContentType="emailAddress"
        keyboardType="email-address"
      />

      <TextInput
        label="Password"
        returnKeyType="done"
        value={password.value}
        onChangeText={(text) => setPassword({value: text, error: ''})}
        error={!!password.error}
        errorText={password.error}
        secureTextEntry
      />

      <View style={styles.forgotPassword}>
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotPasswordScreen')}>
          <Text style={styles.label}>Forgot your password?</Text>
        </TouchableOpacity>
      </View>

      <Button mode="contained" onPress={handleLoginSubmit}>
        Login
      </Button>

      <Button type="text" onPress={handleSkipLoginSubmit}>
        Skip Login
      </Button>

      <View style={styles.row}>
        <Text style={styles.error}>{generalError}</Text>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Don’t have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('RegisterScreen')}>
          <Text style={styles.link}>Sign up</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  forgotPassword: {
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginTop: 4,
  },
  label: {
    color: theme.colors.secondary,
  },
  link: {
    fontWeight: 'bold',
    color: theme.colors.primary,
  },
  error: {
    fontWeight: 'bold',
    color: theme.colors.error,
  },
});

export default memo(LoginScreen);
