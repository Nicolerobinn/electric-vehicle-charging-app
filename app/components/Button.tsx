import React, { memo } from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';
import { type Props } from 'react-native-paper/src/components/Button/Button'
import { theme } from '../core/theme';

const Button = ({ mode, children, ...props }: Props) => (
  <PaperButton
    style={[
      mode === 'contained' && { backgroundColor: theme.colors.primary },
      styles.button,
    ]}
    labelStyle={styles.text}
    mode={mode}
    {...props}>
    {children}
  </PaperButton>
);

const styles = StyleSheet.create({
  button: {
    width: '100%',
    marginVertical: 10,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 15,
    lineHeight: 26,
  },
});

export default memo(Button);
