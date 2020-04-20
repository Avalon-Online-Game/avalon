import React from 'react';
import {View, TextInput, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const defaultInput = props => (
  <View style={styles.container}>
    <TextInput
      {...props}
      placeholderTextColor="#e2d7aa"
      style={[styles.input, props.style]}
    />
  </View>
);

const styles = StyleSheet.create({
  container: {
    width: wp('90%'),
  },
  input: {
    backgroundColor: '#17242c',
    width: '100%',
    height: hp('7%'),
    color: '#e2d7aa',
    fontFamily: 'JosefinSans-Medium',
    fontSize: wp('4.8%'),
    marginTop: hp('1%'),
    opacity: 0.5,
  },
});

export default defaultInput;
