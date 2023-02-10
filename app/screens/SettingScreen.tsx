import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Title from '../components/Title';

const SettingScreen = () => (
  <Background>
    <Logo />
    <Title>Setting Screen</Title>
  </Background>
);

export default memo(SettingScreen);
