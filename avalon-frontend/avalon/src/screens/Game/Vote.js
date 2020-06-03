import React, {Component} from 'react';
import {View, Text, Image, StyleSheet, FlatList} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import MainView from '../../components/UI/Main/MainView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import avatars from '../../utils/avatars';
import {wsSend, setPlayerVote} from '../../store/actions/index';
import color from '../../components/UI/colors';

class VoteScreen extends Component {
  constructor(props) {
    super(props);
    this.questTitle = `Quest ${this.props.currentQuestNumber}`;
  }

  acceptHandler = () => {
    const msg = {
      msg_type: 'quest_vote',
      vote: 'approve',
    };
    this.props.wsSend(msg);
    Navigation.pop(this.props.componentId);
  };

  rejectHandler = () => {
    const msg = {
      msg_type: 'quest_vote',
      vote: 'reject',
    };
    this.props.wsSend(msg);
    Navigation.pop(this.props.componentId);
  };

  playerRenderItem = ({item}) => {
    return (
      <View style={styles.questPlayer}>
        <Image
          source={
            avatars.find(avatar => avatar.id === item.avatar.toString()).image
          }
          style={styles.questPlayerImage}
          resizeMode="contain"
        />
        <Text style={styles.questPlayerText}>{item.username}</Text>
      </View>
    );
  };

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.questTitle}>{this.questTitle}</Text>
        <View style={styles.commander}>
          <Image
            source={require('../../assets/board/king.png')}
            style={styles.commanderImage}
            resizeMode="contain"
          />
          <Text style={styles.commanderText}>
            {this.props.commander.username}
          </Text>
        </View>
        <View style={styles.listContainer}>
          <FlatList
            style={styles.playersList}
            data={this.props.questChosenPlayers}
            renderItem={this.playerRenderItem}
            keyExtractor={item => item.token}
            numColumns={2}
          />
        </View>
        <Text style={styles.voteText}>Vote For The Quest</Text>
        <View style={styles.buttonContainer}>
          <DefaultButton
            buttonStyle={styles.button}
            backgroundStyle={styles.buttonBackground}
            onPress={this.acceptHandler}>
            Approve
          </DefaultButton>
          <DefaultButton
            buttonStyle={styles.button}
            backgroundStyle={styles.buttonBackground}
            onPress={this.rejectHandler}>
            Reject
          </DefaultButton>
        </View>
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  questTitle: {
    color: color.light,
    fontSize: wp('7%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('3%'),
  },
  commander: {
    width: wp('22%'),
    marginTop: hp('3%'),
    alignItems: 'center',
  },
  commanderImage: {
    width: wp('18%'),
    height: wp('18%'),
  },
  commanderText: {
    color: color.light,
    fontSize: wp('5%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Regular',
  },
  listContainer: {
    height: hp('40%'),
  },
  playersList: {},
  questPlayer: {
    width: wp('20%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('5%'),
    alignItems: 'center',
  },
  questPlayerImage: {
    width: wp('18%'),
    height: wp('18%'),
  },
  questPlayerText: {
    color: color.light,
    fontSize: wp('4%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Regular',
  },
  voteText: {
    color: color.light,
    fontSize: wp('6%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    marginTop: hp('0%'),
    marginHorizontal: wp('2%'),
    // backgroundColor: 'green',
  },
  buttonBackground: {
    width: wp('48%'),
    // backgroundColor: 'red',
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
    setPlayerVote: vote => dispatch(setPlayerVote(vote)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(VoteScreen);
