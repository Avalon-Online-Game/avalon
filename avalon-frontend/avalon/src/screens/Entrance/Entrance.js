import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import DefaultButton from '../../components/UI/Entrance/DefaultButton';

class EntranceScreen extends Component {
  skipEntranceHandler = () => {
    Navigation.setRoot({
      root: {
        component: {
          name: 'avalon.AuthScreen',
        },
      },
    });
  };
  render() {
    return (
      <EntranceView>
        <Text style={styles.mainText}>AVALON</Text>
        <DefaultButton
          buttonStyle={styles.skipButton}
          onPress={this.skipEntranceHandler}>
          Skip
        </DefaultButton>
      </EntranceView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  mainText: {
    color: '#e4d7aa',
    fontFamily: 'JosefinSans-Bold',
    fontSize: 50,
    marginTop: '20%',
  },
  skipButton: {
    marginTop: '90%',
  },
});

export default EntranceScreen;
