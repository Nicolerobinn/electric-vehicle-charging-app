import React, { memo } from 'react';
import { TouchableOpacity, Image, StyleSheet, type StyleProp, type ViewStyle } from 'react-native';

interface Props {
  goBack: () => void
  style?: StyleProp<ViewStyle> | undefined;
}
const BackButton = ({ goBack, style }: Props) => (
  <TouchableOpacity onPress={goBack} style={[styles.container, style]}>
    <Image style={styles.image} source={require('../assets/arrow_back.png')} />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 10,
    top: 14,
    zIndex: 9999,
  },
  image: {
    width: 24,
    height: 24,
  },
});

export default memo(BackButton);
