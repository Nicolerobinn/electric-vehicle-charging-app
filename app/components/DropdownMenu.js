import React, {memo, useState} from 'react';
import {View, Image, StyleSheet, Linking} from 'react-native';
import {Button, Menu, Divider} from 'react-native-paper';
import WebSocketClient from '../core/WebSocketClient';
import {loginOut} from '../core/asyncStorage';
// redux
import {useSelector} from 'react-redux';

const DropdownMenu = ({navigation}) => {
  const [visible, setVisible] = useState(false);
  const appData = useSelector((state) => state.appData);
  const {token, permissionList = []} = appData || {};
  const skippedLoginUser = permissionList.length === 0;

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = () => {
    loginOut();
    WebSocketClient.instance.close();
    navigation.navigate('LoginScreen');
  };

  return (
    <View style={styles.wrapper}>
      <Menu
        visible={visible}
        onDismiss={closeMenu}
        anchor={
          <Button onPress={openMenu}>
            <Image
              source={require('../assets/profile.png')}
              style={styles.image}
            />
          </Button>
        }>
        <Menu.Item
          onPress={() => Linking.openURL('https://dev.evnrgy.com/dashboard')}
          title="Options"
        />
        <Menu.Item
          disabled={skippedLoginUser}
          onPress={() => Linking.openURL('https://dev.evnrgy.com/')}
          title="Profile"
        />
        <Divider />
        <Menu.Item onPress={handleLogout} title="Logout" />
      </Menu>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    right: 0,
    top: 5,
  },
  image: {
    width: 30,
    height: 30,
  },
});

export default memo(DropdownMenu);
