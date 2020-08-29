import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import BoardView from '../../components/UI/Game/BoardView';
import BottomButton from '../../components/UI/Game/BottomButton';
import QuestList from '../../components/Game/QuestsList';
import VotingsList from '../../components/Game/VotingsList';
import {
  showRole,
  showPlayers,
  showLeave,
  pushVote,
  showVotingWait,
  showVotingResult,
  pushQuest,
  showQuestWait,
  showQuestResult,
  showAssassination,
  showAssassinationWait,
  showEnd,
  showPlayerDisconnected,
  showPlayerLeft,
  dissmissPlayerDisconnected,
} from './navigation';
import {goMainMenu} from '../Entrance/navigation';
import {wsSend} from '../../store/actions/index';
import DefaultColors from '../../components/UI/colors';
import {showShortBottomToast} from '../../utils/toasts';

class BoardScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
    this.state = {
      inLeaveModal: false,
      inRoleScreen: false,
      inPlayersScreen: false,
    };
    this.leaveConfirmFunction = () => {
      const msg = {
        msg_type: 'leave',
      };
      this.props.wsSend(msg);
      AsyncStorage.multiRemove(['game', 'player']);
      goMainMenu();
    };
  }

  navigationButtonPressed({buttonId}) {
    switch (buttonId) {
      case 'leaveButton': {
        if (!this.state.inLeaveModal) {
          this.setState(
            {
              inLeaveModal: true,
            },
            showLeave(this.leaveConfirmFunction),
          );
        }
        break;
      }
    }
  }

  isPlayerCommander = () => {
    return this.props.commander.token === this.props.playerToken ? true : false;
  };

  async componentDidMount() {
    switch (this.props.gameState) {
      case 'day': {
        showRole();
        break;
      }
      case 'voting': {
        if (
          this.props.questVotedPlayers.find(
            player => player.token === this.props.playerToken,
          ) !== undefined
        ) {
          showVotingWait();
        } else {
          pushVote(this.props.componentId);
        }
        break;
      }
      case 'quest': {
        if (
          this.props.questChosenPlayers.find(
            player => player.token === this.props.playerToken,
          ) !== undefined &&
          this.props.questScoredPlayers.find(
            player => player.token === this.props.playerToken,
          ) === undefined
        ) {
          pushQuest(this.props.componentId);
        } else {
          showQuestWait();
        }
        break;
      }
      case 'assassination': {
        if (this.props.role.id === 'assassin') {
        } else {
          showAssassinationWait();
        }
        break;
      }
      case 'end': {
        showEnd();
        break;
      }
    }

    Navigation.events().registerScreenPoppedListener(({componentId}) => {
      switch (componentId) {
        case 'voteScreen': {
          showVotingWait();
          break;
        }
        case 'questScreen': {
          showQuestWait();
          break;
        }
      }
    });

    Navigation.events().registerModalDismissedListener(
      ({componentId, modalsDismissed}) => {
        switch (componentId) {
          case 'leaveScreen': {
            this.setState({
              inLeaveModal: false,
            });
            break;
          }
          case 'roleScreen': {
            this.setState({
              inRoleScreen: false,
            });
            break;
          }
          case 'questChoiceScreen': {
            this.setState({
              inPlayersScreen: false,
            });
            break;
          }
          case 'playersScreen': {
            this.setState({
              inPlayersScreen: false,
            });
            break;
          }
          case 'votingWaitScreen': {
            showVotingResult();
            break;
          }
          case 'voteResultScreen': {
            if (this.props.gameState === 'quest') {
              if (
                this.props.questChosenPlayers.find(
                  player => player.token === this.props.playerToken,
                ) !== undefined
              ) {
                pushQuest(this.props.componentId);
              } else {
                showQuestWait();
              }
            }
            break;
          }
          case 'questWaitScreen': {
            showQuestResult();
            break;
          }
        }
      },
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.disconnectedPlayers.length === 1) {
      showPlayerDisconnected(
        this.props.disconnectedPlayers[
          this.props.disconnectedPlayers.length - 1
        ],
      );
      return;
    }
    if (
      this.props.disconnectedPlayers.length === 0 &&
      prevProps.disconnectedPlayers.length > 0
    ) {
      dissmissPlayerDisconnected();
      return;
    }
    if (prevProps.leftPlayers.length !== this.props.leftPlayers.length) {
      showPlayerLeft(this.props.leftPlayers[this.props.leftPlayers.length - 1]);
      return;
    }
    if (
      this.props.questVotedPlayers.length !==
        prevProps.questVotedPlayers.length &&
      this.props.questVotedPlayers.length !== this.props.numberOfPlayers
    ) {
      showShortBottomToast(
        `${this.props.questVotedPlayers.length} players has voted`,
      );
      return;
    }
    if (
      this.props.questScoredPlayers.length !==
        prevProps.questScoredPlayers.length &&
      this.props.questScoredPlayers.length !== this.props.numberOfPlayers
    ) {
      showShortBottomToast(
        `${this.props.questScoredPlayers.length} players has done quest`,
      );
      return;
    }
    if (this.props.gameState !== prevProps.gameState) {
      switch (this.props.gameState) {
        case 'voting': {
          pushVote(this.props.componentId);
          break;
        }
        case 'assassination': {
          if (this.props.role.id === 'assassin') {
            showAssassination();
          } else {
            showAssassinationWait();
          }
          break;
        }
        case 'end': {
          showEnd();
          break;
        }
      }
    }
  }

  watchPlayersHandler = () => {
    const isPlayerCommander = this.isPlayerCommander();
    let commanderButtonText = isPlayerCommander ? 'Confirm' : 'Got it';
    let modalId = isPlayerCommander ? 'questChoiceScreen' : 'playersScreen';
    if (!this.state.inPlayersScreen) {
      this.setState(
        {
          inPlayersScreen: true,
        },
        showPlayers(modalId, isPlayerCommander, commanderButtonText),
      );
    }
  };

  watchRoleHandler = () => {
    if (!this.state.inRoleScreen) {
      this.setState(
        {
          inRoleScreen: true,
        },
        showRole(),
      );
    }
  };

  render() {
    let commanderButtonImage = this.isPlayerCommander()
      ? require('../../assets/board/commander.png')
      : require('../../assets/board/players.png');
    return (
      <BoardView style={styles.container}>
        <QuestList style={styles.questsList} />
        <VotingsList style={styles.votingsList} />
        <BottomButton
          style={styles.playersButton}
          onPress={this.watchPlayersHandler}
          icon={commanderButtonImage}
        />
        <View style={styles.bottomContainer}>
          <BottomButton
            style={styles.watchRoleButton}
            onPress={this.watchRoleHandler}
            icon={require('../../assets/board/role-data.png')}
          />
          <View style={styles.roleButtonsContainer}>
            {/* <Tooltip
              popover={
                <Text style={styles.commanderTooltipText}>Commander</Text>
              }
              containerStyle={styles.commanderTooltip}
              withOverlay={false}
              skipAndroidStatusBar={true}> */}
            <View style={styles.commander}>
              <Image
                resizeMode="contain"
                style={styles.roleButtonImage}
                source={require('../../assets/board/king.png')}
              />
              <Text style={styles.commanderText} numberOfLines={1}>
                {this.props.commander.username}
              </Text>
            </View>
            {/* </Tooltip> */}
            {/* <View style={styles.ladyOfTheLake}>
              <Image
                resizeMode="contain"
                style={styles.roleButtonImage}
                source={require('../../assets/board/lady-of-the-lake.png')}
              />
            </View> */}
          </View>
        </View>
      </BoardView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  questsList: {
    height: hp('28%'),
  },
  votingsList: {
    width: wp('90%'),
    height: wp('20%'),
    marginHorizontal: wp('2%'),
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('2%'),
  },
  playersButton: {
    marginHorizontal: wp('2%'),
    marginTop: hp('7%'),
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    marginTop: hp('-4%'),
    height: hp('12%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  roleButtonImage: {
    width: wp('18%'),
    height: wp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  // ladyOfTheLake: {},
  // commanderTooltip: {},
  // commanderTooltipText: {
  //   color: '#e2d7aa',
  //   fontSize: wp('4%'),
  //   textAlign: 'center',
  //   textAlignVertical: 'center',
  //   fontFamily: 'JosefinSans-Regular',
  // },
  commander: {},
  commanderText: {
    color: DefaultColors.light,
    fontSize: wp('4%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Regular',
  },
});

const mapStateToProps = state => {
  return {
    playerToken: state.game.playerToken,
    players: state.game.players,
    commander: state.game.commander,
    quests: state.game.quests,
    numberOfPlayers: state.game.numberOfPlayers,
    currentQuestNumber: state.game.currentQuestNumber,
    failedVotings: state.game.failedVotings,
    gameState: state.game.gameState,
    winner: state.game.winner,
    role: state.game.role,
    roleData: state.game.roleData,
    questChosenPlayers: state.game.questChosenPlayers,
    questCommander: state.game.questCommander,
    questVotedPlayers: state.game.questVotedPlayers,
    questVotingResult: state.game.questVotingResult,
    questPlayersVotes: state.game.questPlayersVotes,
    questScoredPlayers: state.game.questScoredPlayers,
    questScores: state.game.questScores,
    questResult: state.game.questResult,
    assassinatedPlayer: state.game.assassinatedPlayer,
    assassinationResult: state.game.assassinationResult,
    disconnectedPlayers: state.game.disconnectedPlayers,
    leftPlayers: state.game.leftPlayers,
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
)(BoardScreen);
