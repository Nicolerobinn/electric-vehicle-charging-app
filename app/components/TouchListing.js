import React, {memo} from 'react';
import {Button} from 'react-native-paper';
import {StyleSheet, Dimensions, View, Text} from 'react-native';
import ListingComponent from './Listings/ListingComponent';

const TouchListing = ({onChange, list = 0, navigation}) => {
  return (
    <View style={[{width: Dimensions.get('window').width, flex: 1}]}>
      <Button
        style={styles.butotn}
        mode="outlined"
        uppercase={false}
        onPress={() => onChange({})}>
        back to list
      </Button>
      <View style={[{width: '100%', flex: 1}]}>
        {list.length > 0 ? (
          <ListingComponent
            navigation={navigation}
            stations={list}
            propKkey="search"
          />
        ) : (
          <Text>Station not found, please try a different station ID</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {},
  butotn: {},
});

export default memo(TouchListing);
