import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const bottomButton = props => {
  let content =
    props.text !== undefined ? (
      <Text style={styles.buttonText}>{props.text}</Text>
    ) : props.icon !== undefined ? (
      <Image
        resizeMode="contain"
        style={styles.buttonIcon}
        source={props.icon}
      />
    ) : (
      undefined
    );
  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={props.onPress}>
      <ImageBackground
        style={styles.buttonImage}
        source={require('../../../assets/board/board-bottom-button.png')}
        resizeMode="contain">
        {content}
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    // marginHorizontal: wp('5%'),
  },
  buttonImage: {
    width: wp('18%'),
    height: wp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#e2d7aa',
    fontSize: wp('6%'),
    fontFamily: 'JosefinSans-Medium',
  },
  buttonIcon: {
    width: wp('10%'),
    height: wp('10%'),
  },
});

export default bottomButton;
