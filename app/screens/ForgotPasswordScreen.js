import React, {memo, useState} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {emailValidator} from '../core/utils';
import {useSelector} from 'react-redux';
import Background from '../components/Background';
import {RESET_PASSWORD_REQ, RESET_PASSWORD_RES} from '../core/api';
import Logo from '../components/Logo';
import Title from '../components/Title';
import TextInput from '../components/TextInput';
import Button from '../components/Button';
import {useDeepCompareEffect} from '../core/hooks';
import {theme} from '../core/theme';

const ForgotPasswordScreen = ({route, navigation}) => {
  const message = useSelector((state) => state.appData.message);
  const webscoketClient = useSelector((state) => state.appData.webscoketClient);
  // todo: cleanup test data
  const [email, setEmail] = useState({
    value: 'zsyoscar@gmail.com',
    error: '',
  });
  const [passwordResetmessage, setPasswordResetmessage] = useState('');

  useDeepCompareEffect(() => {
    const {command = '', status = ''} = message;
    if (command === RESET_PASSWORD_RES) {
      if (status === 'SUCCESS') {
        setPasswordResetmessage('Check your inbox for a password reset email');
      }
    }
  }, [message]);

  const handleResetSubmit = () => {
    const emailError = emailValidator(email.value);

    if (emailError) {
      setEmail({...email, error: emailError});
      return;
    }

    const requestBody = {
      command: RESET_PASSWORD_REQ, // Required
      payload: {
        email: email.value, // Required
      },
    };
    webscoketClient.sendMessage(requestBody, false);
  };

  return (
    <Background navigation={navigation}>
      <Logo />

      <Title>Restore Password</Title>

      {passwordResetmessage ? (
        <>
          <Text style={styles.text}>{passwordResetmessage}</Text>
          <Button
            mode="contained"
            onPress={() => navigation.navigate('LoginScreen')}
            style={styles.button}>
            Or, try login again
          </Button>
        </>
      ) : (
        <>
          <TextInput
            label="E-mail address"
            returnKeyType="done"
            value={email.value}
            onChangeText={(text) => setEmail({value: text, error: ''})}
            error={!!email.error}
            errorText={email.error}
            autoCapitalize="none"
            autoCompleteType="email"
            textContentType="emailAddress"
            keyboardType="email-address"
          />

          <Button
            mode="contained"
            onPress={handleResetSubmit}
            style={styles.button}>
            Send Reset Instructions
          </Button>
          <TouchableOpacity
            style={styles.back}
            onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.label}>← Back to login</Text>
          </TouchableOpacity>
        </>
      )}
    </Background>
  );
};

const styles = StyleSheet.create({
  back: {
    width: '100%',
    marginTop: 12,
  },
  button: {
    marginTop: 12,
    backgroundColor: theme.colors.primary,
    width: '100%',
  },
  text: {
    color: theme.colors.secondary,
    width: '100%',
    textAlign: 'center',
    marginBottom: '20px',
  },
  label: {
    color: theme.colors.secondary,
    width: '100%',
  },
});

export default memo(ForgotPasswordScreen);
