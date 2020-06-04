import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DefaultColors from '../colors';

const defaultButton = props => {
  return (
    <TouchableOpacity onPress={props.onPress} disabled={props.disabled}>
      <View style={[styles.button, props.buttonStyle]}>
        {props.Icon}
        <Text style={[styles.buttonText, props.textStyle]}>
          {props.children}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('2%'),
    backgroundColor: DefaultColors.light,
    width: wp('90%'),
    height: hp('6.2%'),
  },
  buttonText: {
    color: DefaultColors.dark,
    fontSize: wp('5%'),
    fontFamily: 'JosefinSans-Bold',
  },
});

export default defaultButton;
