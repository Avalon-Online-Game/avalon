import React from 'react';
import {TouchableOpacity, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DefaultColors from '../colors';

const tabButton = props => {
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      <Text style={[styles.buttonText, props.textStyle]}>{props.children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  buttonText: {
    color: DefaultColors.light,
    fontSize: wp('5.5%'),
    fontFamily: 'JosefinSans-Bold',
  },
});

export default tabButton;
