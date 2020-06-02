import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import color from '../colors';

const entranceView = props => {
  return (
    <KeyboardAwareScrollView
      style={styles.container}
      contentContainerStyle={styles.viewContent}>
      {props.children}
    </KeyboardAwareScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: color.dark,
  },
  viewContent: {
    alignItems: 'center',
  },
});

export default entranceView;
