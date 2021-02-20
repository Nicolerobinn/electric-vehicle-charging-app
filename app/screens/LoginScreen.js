import React, {memo, useState, useEffect} from 'react';
import {TouchableOpacity, StyleSheet, Text, View} from 'react-native';
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
  const [firstTimeVisit, setFirstTimeVisit] = useState(true);
  const message = useSelector((state) => state.appData.message) || {};

  useEffect(() => {
    if (
      message.command === 'LoginV2Response' ||
      message.command === 'SkipLoginV1Response'
    ) {
      if (!firstTimeVisit) {
        if (message?.status === 'SUCCESS') {
          console.log(123);
          navigation.navigate('HomeScreen');
        } else if (message?.status === 'ERROR') {
          setGeneralError(message?.message);
        }
      } else {
        // if first time open, clear previous message
        dispatch(Actions.saveMessage({}));
        setFirstTimeVisit(false);
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
      command: 'LoginV2Request', // Required
      payload: {
        email: email.value, // Required
        password: password.value, // Required
      },
    };

    websocketCall(websocket, requestBody, false);
  };

  const handleSkipLoginSubmit = () => {
    const requestBody = {
      command: 'SkipLoginV1Request', // Required
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
