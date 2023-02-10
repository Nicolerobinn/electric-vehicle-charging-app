import React, { memo, useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { Button, Dialog, Portal, Paragraph } from 'react-native-paper';

interface Props {
  visible?: boolean
  hideDialog: () => void
  title: string
  handleChange: (str: string) => void
}
const AndroidTextAlert = ({ visible, hideDialog, title, handleChange }: Props) => {
  const [inputText, setInputText] = useState('');
  return (
    <Portal>
      <Dialog visible={!!visible} onDismiss={hideDialog}>
        <Dialog.Content>
          <Paragraph>{title}</Paragraph>
          <View style={styles.content}>
            <TextInput onChangeText={(text) => setInputText(text)} />
          </View>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={hideDialog}>Cancel</Button>
          <Button onPress={() => handleChange(inputText)}>Ok</Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};
const styles = StyleSheet.create({
  content: { borderBottomWidth: 1, paddingTop: 20 },
});
export default memo(AndroidTextAlert);
