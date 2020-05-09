import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
// import {Tooltip} from 'react-native-elements';
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

class BoardScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    AsyncStorage.getItem('player').then(token => {
      switch (this.props.gameState) {
        case 'voting': {
          if (
            this.props.questVotedPlayers.find(
              player => player.token === JSON.parse(token),
            ) !== undefined
          ) {
            // the player has already voted and must wait for other players to vote
            Navigation.showModal({
              component: {
                name: 'avalon.WaitingScreen',
                options: {
                  modalTransitionStyle: 'crossDissolve',
                  modalPresentationStyle: 'overCurrentContext',
                },
                passProps: {
                  message: 'Waiting for quest voting result',
                },
              },
            });
          } else {
            // the player must vote for the quest
            Navigation.push(this.props.componentId, {
              component: {
                name: 'avalon.VoteScreen',
              },
            });
          }
        }
      }
    });
  }

  componentDidUpdate(prevProps) {
    if (this.props.gameState !== prevProps.gameState) {
      switch (this.props.gameState) {
        case 'voting': {
          Navigation.push(this.props.componentId, {
            component: {
              name: 'avalon.VoteScreen',
            },
          });
          break;
        }
        case 'quest': {
          Navigation.push(this.props.componentId, {
            component: {
              name: 'avalon.VoteResultScreen',
            },
          });
        }
      }
    }
  }

  commanderCommandHandler = () => {
    Navigation.showModal({
      component: {
        name: 'avalon.PlayersScreen',
        options: {
          modalTransitionStyle: 'crossDissolve',
          modalPresentationStyle: 'overCurrentContext',
        },
      },
    });
  };

  watchRoleHandler = () => {
    Navigation.showModal({
      component: {
        name: 'avalon.RoleScreen',
        options: {
          modalTransitionStyle: 'crossDissolve',
          modalPresentationStyle: 'overCurrentContext',
        },
      },
    });
  };

  render() {
    return (
      <BoardView style={styles.container}>
        <QuestList
          style={styles.questsList}
          numberOfPlayers={this.props.numberOfPlayers}
        />
        <BottomButton
          style={styles.commanderCommandButton}
          onPress={this.commanderCommandHandler}
          icon={require('../../assets/board/commander.png')}
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
  questsList: {
    height: hp('25%'),
    marginTop: hp('2%'),
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('2%'),
  },
  commanderCommandButton: {
    marginTop: hp('18%'),
    marginHorizontal: wp('2%'),
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    marginTop: hp('-3%'),
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
  commander: {
    // backgroundColor: 'red',
  },
  commanderText: {
    color: '#e2d7aa',
    fontSize: wp('4%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Regular',
    // backgroundColor: 'green',
  },
});

const mapStateToProps = state => {
  return {
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
    questScores: state.game.questScores,
    questResult: state.game.questResult,
    assassinatedPlayer: state.game.assassinatedPlayer,
    assassinationResult: state.game.assassinationResult,
  };
};

export default connect(mapStateToProps)(BoardScreen);
