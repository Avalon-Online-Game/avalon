import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';

import MainView from '../../components/UI/Main/MainView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {heightPercentageToDP as hp} from 'react-native-responsive-screen';
import {showLogout, pushCreateGame, pushJoinGame} from '../../utils/navigation';

class MainMenuScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      inLogoutModal: false,
    };
  }

  navigationButtonPressed({buttonId}) {
    switch (buttonId) {
      case 'logoutButton': {
        if (!this.state.inLogoutModal) {
          this.setState(
            {
              inLogoutModal: true,
            },
            showLogout(),
          );
        }
        break;
      }
    }
  }

  componentDidMount() {
    Navigation.events().registerModalDismissedListener(
      ({componentId, modalsDismissed}) => {
        switch (componentId) {
          case 'logoutScreen': {
            this.setState({
              inLogoutModal: false,
            });
            break;
          }
        }
      },
    );
  }

  createGameHandler = () => {
    pushCreateGame();
  };

  joinGameHandler = () => {
    pushJoinGame();
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
