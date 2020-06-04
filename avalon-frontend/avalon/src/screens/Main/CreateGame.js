import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';
import Toast, {DURATION} from 'react-native-easy-toast';

import MainView from '../../components/UI/Main/MainView';
import BottomButton from '../../components/UI/Main/BottomButton';
import RolesList from '../../components/CreateGame/RolesList';
import ChosenRolesList from '../../components/CreateGame/ChosenRolesList';
import API from '../../utils/API';
import {removeRole, setNumberOfPlayers} from '../../store/actions/index';
import {chosenRolesValidation} from '../../utils/rolesValidation';
import {pushShareGame} from '../../utils/navigation';
import DefaultColors from '../../components/UI/colors';

class CreateGameScreen extends Component {
  validateChosenRoles = () => {
    const validation = chosenRolesValidation(this.props.chosenRoles);
    if (!validation.validation) {
      this.toast.show(validation.errorMessage, DURATION.LENGTH_LONG);
      return false;
    }
    return true;
  };

  createGameHandler = async () => {
    if (!this.validateChosenRoles()) {
      return;
    }
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${user.key}`,
    };
    API.post(
      'games/',
      {
        number_of_players: this.props.numberOfPlayers,
        roles: this.props.chosenRoles.map(role => role.id),
      },
      {
        headers: headers,
      },
    )
      .then(gameRes => {
        AsyncStorage.setItem('game', JSON.stringify(gameRes.data.code));
        API.post(
          'players/',
          {
            game: gameRes.data.code,
          },
          {
            headers: headers,
          },
        )
          .then(async playerRes => {
            AsyncStorage.setItem(
              'player',
              JSON.stringify(playerRes.data.token),
            );
            pushShareGame();
          })
          .catch(err => {
            console.log(
              `Failed to register player to the game: ${err.response.status}`,
            );
            this.toast.show(
              'Whoops... something went wrong!',
              DURATION.LENGTH_LONG,
            );
          });
      })
      .catch(err => {
        console.log(`Failed to register the game: ${err.response.status}`);
        this.toast.show(
          'Whoops... something went wrong!',
          DURATION.LENGTH_LONG,
        );
      });
  };

  handleIncreaseNumberOfPlayers = () => {
    if (this.props.numberOfPlayers < this.props.maxNumberOfPlayers) {
      this.props.setNumberOfPlayers(this.props.numberOfPlayers + 1);
    }
  };

  handleDecreaseNumberOfPlayers = () => {
    if (this.props.numberOfPlayers > this.props.minNumberOfPlayers) {
      if (this.props.chosenRoles.length === this.props.numberOfPlayers) {
        this.props.removeRole(
          this.props.chosenRoles[this.props.chosenRoles.length - 1],
        );
      }
      this.props.setNumberOfPlayers(this.props.numberOfPlayers - 1);
    }
  };

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.numberPickerText}>Number of Players</Text>
        <View style={styles.numberPickerContainer}>
          <TouchableHighlight
            onPress={this.handleDecreaseNumberOfPlayers}
            disabled={
              this.props.numberOfPlayers === this.props.minNumberOfPlayers
                ? true
                : false
            }>
            <Icon
              style={
                this.props.numberOfPlayers === this.props.minNumberOfPlayers
                  ? styles.numberPickerIconDeactive
                  : styles.numberPickerIconActive
              }
              name="md-arrow-dropdown"
              color={DefaultColors.light}
              size={wp('12%')}
            />
          </TouchableHighlight>
          <Text style={styles.numberText}>{this.props.numberOfPlayers}</Text>
          <TouchableHighlight
            onPress={this.handleIncreaseNumberOfPlayers}
            disabled={
              this.props.numberOfPlayers === this.props.maxNumberOfPlayers
                ? true
                : false
            }>
            <Icon
              style={
                this.props.numberOfPlayers === this.props.maxNumberOfPlayers
                  ? styles.numberPickerIconDeactive
                  : styles.numberPickerIconActive
              }
              name="md-arrow-dropup"
              color={DefaultColors.light}
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
        <Toast
          ref={ref => {
            this.toast = ref;
          }}
          style={styles.toast}
          positionValue={hp('30%')}
          fadeInDuration={500}
          textStyle={styles.toastText}
        />
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
    color: DefaultColors.light,
    fontSize: wp('6%'),
    fontFamily: 'JosefinSans-Medium',
  },
  numberPickerIconActive: {
    opacity: 1,
  },
  numberPickerIconDeactive: {
    opacity: 0.5,
  },
  numberText: {
    backgroundColor: '#17242c',
    width: wp('8%'),
    color: DefaultColors.light,
    textAlign: 'center',
    fontSize: wp('6%'),
    marginHorizontal: wp('3%'),
  },
  chosenRolesList: {
    height: hp('11%'),
    marginTop: hp('2%'),
    alignSelf: 'flex-start',
  },
  rolesListText: {
    color: DefaultColors.light,
    fontSize: wp('4.5%'),
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('2%'),
  },
  rolesList: {
    marginTop: hp('1%'),
    height: hp('18%'),
  },
  toast: {
    borderRadius: 30,
    backgroundColor: '#17242c',
  },
  toastText: {
    color: DefaultColors.light,
    textAlign: 'center',
    fontFamily: 'JosefinSans-Regular',
    fontSize: wp('4.5%'),
    lineHeight: hp('2.8%'),
  },
});

const mapStateToProps = state => {
  return {
    chosenRoles: state.roles.chosenRoles,
    numberOfPlayers: state.roles.numberOfPlayers,
    maxNumberOfPlayers: state.roles.maxNumberOfPlayers,
    minNumberOfPlayers: state.roles.minNumberOfPlayers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setNumberOfPlayers: numberOfPlayers =>
      dispatch(setNumberOfPlayers(numberOfPlayers)),
    removeRole: role => dispatch(removeRole(role)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(CreateGameScreen);
