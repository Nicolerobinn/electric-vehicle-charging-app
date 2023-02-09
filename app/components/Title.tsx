import React, {memo} from 'react';
import {StyleSheet, Text} from 'react-native';
import {theme} from '../core/theme';

const Title = ({children}) => <Text style={styles.title}>{children}</Text>;

const styles = StyleSheet.create({
  title: {
    fontSize: 26,
    color: theme.colors.primary,
    fontWeight: 'bold',
    paddingVertical: 14,
    textAlign: 'center',
  },
});

export default memo(Title);
