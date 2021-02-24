import React, {memo} from 'react';
import {
  ImageBackground,
  StyleSheet,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
  Platform,
} from 'react-native';
import BackButton from '../components/BackButton';

const Background = ({children, navigation}) => (
  <>
    <ImageBackground
      source={require('../assets/background_dot.png')}
      resizeMode="repeat"
      style={styles.background}>
      {navigation && <BackButton goBack={() => navigation.goBack(null)} />}
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <ScrollView>{children}</ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  </>
);

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    padding: 20,
    paddingTop: 54,
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

export default memo(Background);
