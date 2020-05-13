import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import MainView from '../../components/UI/Main/MainView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {wsSend} from '../../store/actions/index';

class VoteScreen extends Component {
  constructor(props) {
    super(props);
    this.questTitle = `Quest ${this.props.currentQuestNumber}`;
  }

  successHandler = () => {
    const msg = {
      msg_type: 'quest',
      score: 'success',
    };
    this.props.wsSend(msg);
    Navigation.pop(this.props.componentId);
  };

  failHandler = () => {
    const msg = {
      msg_type: 'quest',
      score: 'fail',
    };
    this.props.wsSend(msg);
    Navigation.pop(this.props.componentId);
  };

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.questTitle}>{this.questTitle}</Text>
        <Text style={styles.mainText}>Choose your quest result</Text>
        <View style={styles.buttonContainer}>
          <DefaultButton
            buttonStyle={styles.button}
            backgroundStyle={styles.buttonBackground}
            onPress={this.successHandler}>
            Success
          </DefaultButton>
          <DefaultButton
            buttonStyle={styles.button}
            backgroundStyle={styles.buttonBackground}
            onPress={this.failHandler}>
            Fail
          </DefaultButton>
        </View>
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // justifyContent: 'center',
    // alignItems: 'center',
  },
  questTitle: {
    color: '#e2d7aa',
    fontSize: wp('7%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('3%'),
  },
  mainText: {
    marginTop: hp('10%'),
    color: '#e2d7aa',
    fontSize: wp('6%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  buttonContainer: {
    marginTop: hp('25%'),
  },
  button: {
    marginTop: hp('2%'),
  },
  buttonBackground: {
    width: wp('80%'),
  },
});

const mapStateToProps = state => {
  return {
    // players: state.game.players,
    commander: state.game.commander,
    // quests: state.game.quests,
    // numberOfPlayers: state.game.numberOfPlayers,
    currentQuestNumber: state.game.currentQuestNumber,
    // failedVotings: state.game.failedVotings,
    gameState: state.game.gameState,
    // winner: state.game.winner,
    // role: state.game.role,
    // roleData: state.game.roleData,
    questChosenPlayers: state.game.questChosenPlayers,
    // questVotedPlayers: state.game.questVotedPlayers,
    // questVotingResult: state.game.questVotingResult,
    // questPlayersVotes: state.game.questPlayersVotes,
    // questScores: state.game.questScores,
    // questResult: state.game.questResult,
    // assassinatedPlayer: state.game.assassinatedPlayer,
    // assassinationResult: state.game.assassinationResult,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    wsSend: msg => dispatch(wsSend(msg)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VoteScreen);
