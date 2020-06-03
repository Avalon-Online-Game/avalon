import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import DefaultColors from '../colors';

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
    backgroundColor: DefaultColors.dark,
  },
  viewContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default entranceView;
