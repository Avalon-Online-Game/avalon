import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const entranceView = props => {
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.viewContent}>
      <Image
        style={styles.castleImage}
        source={require('../../../assets/main/castle.png')}
        resizeMode="contain"
      />
      {props.children}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0B161C',
  },
  castleImage: {
    width: hp('30%'),
    height: hp('30%'),
    marginTop: hp('8%'),
  },
  viewContent: {
    alignItems: 'center',
  },
});

export default entranceView;
