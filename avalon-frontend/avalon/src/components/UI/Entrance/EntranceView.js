import React from 'react';
import {StyleSheet} from 'react-native';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

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
    backgroundColor: '#0B161C',
  },
  viewContent: {
    alignItems: 'center',
  },
});

export default entranceView;
