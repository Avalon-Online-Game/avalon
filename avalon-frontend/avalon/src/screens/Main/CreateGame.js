import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import MainView from '../../components/UI/Main/MainView';
import BottomButton from '../../components/UI/Main/BottomButton';
import RolesList from '../../components/CreateGame/RolesList';
import ChosenRolesList from '../../components/CreateGame/ChosenRolesList';
import API from '../../utils/API';
import {Navigation} from 'react-native-navigation';

class CreateGameScreen extends Component {
  constructor() {
    super();
    this.state = {
      numberOfPlayers: '5',
    };
    this.maxNumberOfPlayers = '10';
    this.minNumberOfPlayers = '5';
  }

  createGameHandler = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${user.key}`,
    };
    API.post(
      'games/',
      {
        number_of_players: this.state.numberOfPlayers,
        roles: this.props.chosenRoles.map(role => role.id),
      },
      {
        headers: headers,
      },
    )
      .then(res => {
        AsyncStorage.setItem('game', JSON.stringify(res.data.code));
        API.post(
          'players/',
          {
            game: res.data.code,
          },
          {
            headers: headers,
          },
        )
          .then(async res => {
            AsyncStorage.setItem('player', JSON.stringify(res.data.token));
            Navigation.push(this.props.componentId, {
              component: {
                name: 'avalon.ShareGameCodeScreen',
                passProps: {
                  gameCode: await AsyncStorage.getItem('game').then(gameCode =>
                    gameCode.toString(),
                  ),
                },
              },
            });
          })
          .catch(err => {
            alert('Failed to register player to the game');
          });
      })
      .catch(err => {
        alert('Failed to register the game');
      });
  };

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.numberPickerText}>Number of Players</Text>
        <View style={styles.numberPickerContainer}>
          <TouchableHighlight
            onPress={() => {
              if (this.state.numberOfPlayers !== this.minNumberOfPlayers) {
                this.setState({
                  numberOfPlayers: (
                    parseInt(this.state.numberOfPlayers, 10) - 1
                  ).toString(),
                });
              }
            }}
            disabled={
              this.state.numberOfPlayers === this.minNumberOfPlayers
                ? true
                : false
            }>
            <Icon
              style={styles.numberPickerIcon}
              name="md-arrow-dropdown"
              color="#e2d7aa"
              size={wp('12%')}
            />
          </TouchableHighlight>
          <Text style={styles.numberText}>{this.state.numberOfPlayers}</Text>
          <TouchableHighlight
            onPress={() => {
              if (this.state.numberOfPlayers !== this.maxNumberOfPlayers) {
                this.setState({
                  numberOfPlayers: (
                    parseInt(this.state.numberOfPlayers, 10) + 1
                  ).toString(),
                });
              }
            }}>
            <Icon
              style={styles.numberPickerIcon}
              name="md-arrow-dropup"
              color="#e2d7aa"
              size={wp('12%')}
            />
          </TouchableHighlight>
        </View>
        <ChosenRolesList style={styles.chosenRolesList} />
        <Text style={styles.rolesListText}>Loyal Servants of Arthur</Text>
        <RolesList style={styles.rolesList} side="good" />
        <Text style={styles.rolesListText}>Minions of Mordred</Text>
        <RolesList style={styles.rolesList} side="evil" />
        <BottomButton
          style={styles.bottomButton}
          onPress={this.createGameHandler}>
          Next
        </BottomButton>
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  numberPickerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: hp('5%'),
    marginTop: hp('1%'),
  },
  numberPickerText: {
    color: '#e2d7aa',
    fontSize: wp('6%'),
    fontFamily: 'JosefinSans-Medium',
  },
  numberText: {
    backgroundColor: '#17242c',
    width: wp('8%'),
    color: '#e2d7aa',
    textAlign: 'center',
    fontSize: wp('6%'),
    marginHorizontal: wp('3%'),
  },
  chosenRolesList: {
    height: hp('11%'),
    marginTop: hp('2%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rolesListText: {
    color: '#e2d7aa',
    fontSize: wp('4.5%'),
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('2%'),
  },
  rolesList: {
    marginTop: hp('1%'),
    height: hp('18%'),
  },
});

const mapStateToProps = state => {
  return {
    chosenRoles: state.roles.chosenRoles,
  };
};

export default connect(mapStateToProps)(CreateGameScreen);
