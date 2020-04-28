import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
  Image,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const bottomButton = props => {
  return (
    <TouchableOpacity
      style={[styles.button, props.style]}
      onPress={props.onPress}>
      <ImageBackground
        style={styles.buttonImage}
        source={require('../../../assets/board/board-bottom-button.png')}
        resizeMode="contain">
        <Image
          resizeMode="contain"
          style={styles.buttonIcon}
          source={props.icon}
        />
      </ImageBackground>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: wp('18%'),
  },
  buttonImage: {
    width: wp('18%'),
    height: wp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonIcon: {
    width: wp('10%'),
    height: wp('10%'),
  },
  roleButtonContainer: {
    height: wp('20%'),
    width: wp('20%'),
    // marginTop: hp('-7%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  // roleButtonText: {
  //   color: '#e2d7aa',
  //   fontSize: wp('4.5%'),
  //   fontFamily: 'JosefinSans-Medium',
  //   textAlign: 'center',
  //   textAlignVertical: 'center',
  // },
});

export default bottomButton;
