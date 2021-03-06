import React from 'react';
import {
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import DefaultColors from '../colors';

const defaultButton = props => {
  let buttonContent = (
    <ImageBackground
      source={require('../../../assets/main/button.png')}
      style={[styles.buttonImage, props.backgroundStyle]}
      resizeMode="contain">
      <Text style={[styles.buttonText, props.textStyle]}>{props.children}</Text>
    </ImageBackground>
  );
  if (props.transparentButton) {
    buttonContent = (
      <Text style={[styles.buttonText, props.textStyle]}>{props.children}</Text>
    );
  }
  return (
    <TouchableOpacity
      style={[styles.container, props.buttonStyle]}
      onPress={props.onPress}
      disabled={props.disabled}>
      {buttonContent}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: hp('8%'),
  },
  buttonImage: {
    width: wp('80%'),
    height: hp('10%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: DefaultColors.dark,
    fontSize: wp('6%'),
    fontFamily: 'JosefinSans-Bold',
  },
});

export default defaultButton;
