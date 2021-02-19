import React, { memo } from 'react';
import Background from '../components/Background';
import Logo from '../components/Logo';
import Title from '../components/Title';
import Button from '../components/Button';
import Paragraph from '../components/Paragraph';

const HomeScreen = ({ navigation }) => (
  <Background>
    <Logo />
    <Title>Setting Screen</Title>

    
    
  </Background>
);

export default memo(HomeScreen);
