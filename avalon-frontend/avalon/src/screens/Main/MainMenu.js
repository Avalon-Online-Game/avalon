import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';

import MainView from '../../components/UI/Main/MainView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class MainMenuScreen extends Component {
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
      <MainView style={styles.constainer}>
        <View style={styles.constainer}>
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
            onPress={this.playersChartHandler}>
            Players Chart
          </DefaultButton>
          <DefaultButton
            buttonStyle={styles.button}
            onPress={this.cardsAndRolesHandler}>
            Cards & Roles
          </DefaultButton>
        </View>
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  constainer: {
    paddingTop: hp('3%'),
  },
  button: {
    marginTop: hp('5%'),
  },
});

export default MainMenuScreen;
