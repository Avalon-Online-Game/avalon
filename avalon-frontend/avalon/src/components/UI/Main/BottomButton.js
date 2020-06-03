import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DefaultColors from '../colors';

const bottomButton = props => {
  return (
    <TouchableOpacity
      style={[styles.button, props.buttonStyle]}
      disabled={props.disabled}
      onPress={props.onPress}>
      <Text style={[styles.buttonText, props.textStyle]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('3%'),
    backgroundColor: DefaultColors.light,
    width: wp('100%'),
    height: hp('8%'),
  },
  buttonText: {
    color: DefaultColors.dark,
    fontSize: wp('6%'),
    fontFamily: 'JosefinSans-Bold',
  },
});

export default bottomButton;
