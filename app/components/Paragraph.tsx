import React, { memo } from 'react';
import { StyleSheet, Text } from 'react-native';

const Paragraph = ({ children }: { children: React.ReactNode }) => <Text style={styles.text}>{children}</Text>;

const styles = StyleSheet.create({
  text: {
    fontSize: 16,
    lineHeight: 26,
    textAlign: 'center',
    marginBottom: 14,
  },
});

export default memo(Paragraph);
