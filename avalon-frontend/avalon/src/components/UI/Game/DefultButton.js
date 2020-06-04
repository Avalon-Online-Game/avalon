import React from 'react';
import {
  TouchableOpacity,
  ImageBackground,
  Text,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DefaultColors from '../colors';

const defaultButton = props => {
  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={props.onPress}>
      <ImageBackground
        source={require('../../../assets/popups/button.png')}
        style={styles.buttonImage}
        resizeMode="contain">
        <Text style={styles.buttonText}>{props.children}</Text>
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonImage: {
    width: wp('60%'),
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: DefaultColors.dark,
    fontSize: wp('6%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Bold',
  },
});

export default defaultButton;
