import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';

const SplashScreen = () => (
  <Background>
    <Logo />
  </Background>
);

export default memo(SplashScreen);
