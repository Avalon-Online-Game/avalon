import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import color from '../colors';

const boardView = props => {
  return (
    <View style={styles.container}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require('../../../assets/board/board-back.png')}
      />
      <View style={[styles.childrenContainer, props.style]}>
        {props.children}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.dark,
  },
  image: {
    width: wp('100%'),
    height: hp('25%'),
    // backgroundColor: 'green',
  },
  // childrenContainer: {
  //   justifyContent: 'space-between',
  // },
});

export default boardView;
