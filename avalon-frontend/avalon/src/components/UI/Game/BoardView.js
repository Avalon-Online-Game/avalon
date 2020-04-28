import React from 'react';
import {View, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const boardView = props => {
  return (
    <View style={[styles.container, props.style]}>
      <Image
        resizeMode="contain"
        style={styles.image}
        source={require('../../../assets/board/board-back.png')}
      />
      {props.children}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B161C',
  },
  image: {
    width: wp('100%'),
    height: hp('25%'),
  },
});

export default boardView;
