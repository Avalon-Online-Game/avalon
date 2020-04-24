import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const bottomButton = props => {
  return (
    <TouchableOpacity
      style={[styles.button, props.buttonStyle]}
      onPress={props.onPress}>
      {props.Icon}
      <Text style={[styles.buttonText, props.textStyle]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e2d7aa',
    width: wp('20%'),
    height: hp('10%'),
    marginHorizontal: wp('8%'),
  },
  buttonText: {
    color: '#0b161c',
    fontSize: wp('5%'),
    fontFamily: 'JosefinSans-Bold',
  },
});

export default bottomButton;
