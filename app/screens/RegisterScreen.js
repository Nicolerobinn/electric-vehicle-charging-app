import React, {memo, useState, useEffect} from 'react';
import {useSelector} from 'react-redux';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Title from '../components/Title';
import Button from '../components/Button';
import TextInput from '../components/TextInput';
import BackButton from '../components/BackButton';
import {theme} from '../core/theme';
import {
  emailValidator,
  passwordValidator,
  confirmPasswordValidator,
  passwordMatch,
  websocketCall,
} from '../core/utils';

const RegisterScreen = ({route, navigation}) => {
  const message = useSelector((state) => state.appData.message);
  const {websocket} = route.params;

  // todo: cleanup test data
  const [email, setEmail] = useState({
    value: 'zsyoscar@gmail.com',
    error: '',
  });
  const [password, setPassword] = useState({value: 'abcabc', error: ''});
  const [confirmPassword, setConfirmPassword] = useState({
    value: 'abcabc',
    error: '',
  });
  const [generalError, setGeneralError] = useState('');

  useEffect(() => {
    if (message?.status === 'SUCCESS') {
      navigation.navigate('HomeScreen');
    } else if (message?.status === 'ERROR') {
      setGeneralError(message?.message);
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
      setEmail({...email, error: emailError});
      setPassword({...password, error: passwordError});
      setConfirmPassword({...confirmPassword, error: confirmPasswordError});
      return;
    }
    if (passwordMatchError) {
      setGeneralError(confirmPasswordError);
      return;
    }

    const requestBody = {
      command: 'UserRegistrationV1Request', // Required
      payload: {
        email: email.value, // Required
        password: password.value, // Required
      },
    };

    const response = websocketCall(websocket, requestBody, false);
    if (response?.status === 'success') {
      // navigation.navigate('HomeScreen');
    }
  };

  return (
    <Background>
      <BackButton goBack={() => navigation.navigate('HomeScreen')} />

      <Logo />

      <Title>Create Account</Title>

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

      <TextInput
        label="ConfirmPassword"
        returnKeyType="done"
        value={confirmPassword.value}
        onChangeText={(text) => setConfirmPassword({value: text, error: ''})}
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
      <View style={styles.row}>
        <Text style={styles.label}>Already have an account? </Text>
        <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
          <Text style={styles.link}>Login</Text>
        </TouchableOpacity>
      </View>
    </Background>
  );
};

const styles = StyleSheet.create({
  label: {
    color: theme.colors.secondary,
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
    fontWeight: 'bold',
    color: theme.colors.error,
  },
});

export default memo(RegisterScreen);
