import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';

import MainView from '../../components/UI/Main/MainView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

import {goAuth} from '../../utils/navigation';

class MainMenuScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({buttonId}) {
    switch (buttonId) {
      case 'logoutButton': {
        Navigation.showModal({
          component: {
            id: 'logoutScreen',
            name: 'avalon.ConfirmScreen',
            options: {
              modalTransitionStyle: 'crossDissolve',
              modalPresentationStyle: 'overCurrentContext',
            },
            passProps: {
              message: 'Are you sure you want to logout?',
              confirmFunction: () => {
                AsyncStorage.removeItem('user');
                goAuth();
              },
            },
          },
        });
        break;
      }
    }
  }

  createGameHandler = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'avalon.CreateGameScreen',
      },
    });
  };

  joinGameHandler = () => {
    Navigation.push(this.props.componentId, {
      component: {
        name: 'avalon.JoinGameScreen',
      },
    });
  };

  playersChartHandler = () => {};

  cardsAndRolesHandler = () => {};

  render() {
    return (
      <MainView style={styles.background}>
        <View style={styles.buttonsView}>
          <DefaultButton
            buttonStyle={styles.button}
            onPress={this.createGameHandler}>
            Create New Game
          </DefaultButton>
          <DefaultButton
            buttonStyle={styles.button}
            onPress={this.joinGameHandler}>
            Join Game
          </DefaultButton>
          <DefaultButton
            buttonStyle={styles.button}
            disabled={true}
            onPress={this.playersChartHandler}>
            Players Chart
          </DefaultButton>
          <DefaultButton
            buttonStyle={styles.button}
            disabled={true}
            onPress={this.cardsAndRolesHandler}>
            Cards & Roles
          </DefaultButton>
        </View>
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  background: {
    justifyContent: 'center',
  },
  buttonsView: {
    height: hp('60%'),
    marginTop: hp('-5%'),
    justifyContent: 'space-between',
  },
  button: {
    marginTop: hp('0%'),
  },
});

export default MainMenuScreen;
