import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const Add = () => {
  return (
    <View style={styles.mainContainer}>
      <Text>Add</Text>
    </View>
  );
};

export default Add;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
