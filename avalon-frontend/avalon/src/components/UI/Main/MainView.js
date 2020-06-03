import React from 'react';
import {View, StyleSheet} from 'react-native';

import color from '../colors';

const mainView = props => {
  return <View style={[styles.container, props.style]}>{props.children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: color.dark,
  },
});

export default mainView;
