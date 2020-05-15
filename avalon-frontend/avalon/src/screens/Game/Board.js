import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
// import {Tooltip} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import BoardView from '../../components/UI/Game/BoardView';
import BottomButton from '../../components/UI/Game/BottomButton';
import QuestList from '../../components/Game/QuestsList';
import VotingsList from '../../components/Game/VotingsList';

class BoardScreen extends Component {
  constructor(props) {
    super(props);
    this.questWaitMessage = 'heroes are in quest';
    this.votingWaitMessage = 'other players are voting';
    this.assassinationWaitMessage = 'assassin is choosing a player';
  }

  isPlayerCommander = () => {
    return this.props.commander.token === this.props.playerToken ? true : false;
  };

  async componentDidMount() {
    switch (this.props.gameState) {
      case 'voting': {
        if (
          this.props.questVotedPlayers.find(
            player => player.token === this.props.playerToken,
          ) !== undefined
        ) {
          Navigation.showModal({
            component: {
              id: 'votingWaitScreen',
              name: 'avalon.WaitingScreen',
              options: {
                modalTransitionStyle: 'crossDissolve',
                modalPresentationStyle: 'overCurrentContext',
              },
              passProps: {
                message: this.votingWaitMessage,
              },
            },
          });
        } else {
          Navigation.push(this.props.componentId, {
            component: {
              id: 'voteScreen',
              name: 'avalon.VoteScreen',
            },
          });
        }
        break;
      }
      case 'quest': {
        console.log(this.props.questChosenPlayers);
        if (
          this.props.questChosenPlayers.find(
            player => player.token === this.props.playerToken,
          ) !== undefined
        ) {
          Navigation.push(this.props.componentId, {
            component: {
              id: 'questScreen',
              name: 'avalon.QuestScreen',
            },
          });
        } else {
          Navigation.showModal({
            component: {
              id: 'questWaitScreen',
              name: 'avalon.WaitingScreen',
              options: {
                modalTransitionStyle: 'crossDissolve',
                modalPresentationStyle: 'overCurrentContext',
              },
              passProps: {
                message: this.questWaitMessage,
              },
            },
          });
        }
        break;
      }
      case 'assassination': {
        if (this.props.role.id === 'assassin') {
          Navigation.showModal({
            component: {
              id: 'assassinationScreen',
              name: 'avalon.AssassinationScreen',
              options: {
                modalTransitionStyle: 'crossDissolve',
                modalPresentationStyle: 'overCurrentContext',
              },
            },
          });
        } else {
          Navigation.showModal({
            component: {
              id: 'assassinationWaitScreen',
              name: 'avalon.WaitingScreen',
              options: {
                modalTransitionStyle: 'crossDissolve',
                modalPresentationStyle: 'overCurrentContext',
              },
              passProps: {
                message: this.assassinationWaitMessage,
              },
            },
          });
        }
        break;
      }
      case 'end': {
        Navigation.showModal({
          component: {
            id: 'endScreen',
            name: 'avalon.EndScreen',
            options: {
              modalTransitionStyle: 'crossDissolve',
              modalPresentationStyle: 'overCurrentContext',
            },
            passProps: {
              message: this.assassinationWaitMessage,
            },
          },
        });
        break;
      }
    }

    Navigation.events().registerScreenPoppedListener(({componentId}) => {
      switch (componentId) {
        case 'voteScreen': {
          console.log('opening vote waiting');
          Navigation.showModal({
            component: {
              id: 'votingWaitScreen',
              name: 'avalon.WaitingScreen',
              options: {
                modalTransitionStyle: 'crossDissolve',
                modalPresentationStyle: 'overCurrentContext',
              },
              passProps: {
                message: this.votingWaitMessage,
              },
            },
          });
          break;
        }
        case 'questScreen': {
          Navigation.showModal({
            component: {
              id: 'questWaitScreen',
              name: 'avalon.WaitingScreen',
              options: {
                modalTransitionStyle: 'crossDissolve',
                modalPresentationStyle: 'overCurrentContext',
              },
              passProps: {
                message: this.questWaitMessage,
              },
            },
          });
        }
      }
    });

    Navigation.events().registerModalDismissedListener(
      ({componentId, modalsDismissed}) => {
        switch (componentId) {
          case 'votingWaitScreen': {
            console.log('opening vote result');
            Navigation.showModal({
              component: {
                id: 'voteResultScreen',
                name: 'avalon.VoteResultScreen',
                options: {
                  modalTransitionStyle: 'crossDissolve',
                  modalPresentationStyle: 'overCurrentContext',
                },
              },
            });
            break;
          }
          case 'voteResultScreen': {
            if (this.props.gameState === 'quest') {
              if (
                this.props.questChosenPlayers.find(
                  player => player.token === this.props.playerToken,
                ) !== undefined
              ) {
                Navigation.push(this.props.componentId, {
                  component: {
                    id: 'questScreen',
                    name: 'avalon.QuestScreen',
                  },
                });
              } else {
                Navigation.showModal({
                  component: {
                    id: 'questWaitScreen',
                    name: 'avalon.WaitingScreen',
                    options: {
                      modalTransitionStyle: 'crossDissolve',
                      modalPresentationStyle: 'overCurrentContext',
                    },
                    passProps: {
                      message: this.questWaitMessage,
                    },
                  },
                });
              }
            }
            break;
          }
          case 'questWaitScreen': {
            Navigation.showModal({
              component: {
                id: 'questResultScreen',
                name: 'avalon.QuestResultScreen',
                options: {
                  modalTransitionStyle: 'crossDissolve',
                  modalPresentationStyle: 'overCurrentContext',
                },
              },
            });
            break;
          }
        }
      },
    );
  }

  componentDidUpdate(prevProps) {
    console.log(this.props.gameState);
    if (this.props.gameState !== prevProps.gameState) {
      switch (this.props.gameState) {
        case 'voting': {
          Navigation.push(this.props.componentId, {
            component: {
              id: 'voteScreen',
              name: 'avalon.VoteScreen',
            },
          });
          break;
        }
        case 'assassination': {
          if (this.props.role.id === 'assassin') {
            Navigation.showModal({
              component: {
                id: 'assassinationScreen',
                name: 'avalon.AssassinationScreen',
                options: {
                  modalTransitionStyle: 'crossDissolve',
                  modalPresentationStyle: 'overCurrentContext',
                },
              },
            });
          } else {
            Navigation.showModal({
              component: {
                id: 'assassinationWaitScreen',
                name: 'avalon.WaitingScreen',
                options: {
                  modalTransitionStyle: 'crossDissolve',
                  modalPresentationStyle: 'overCurrentContext',
                },
                passProps: {
                  message: this.assassinationWaitMessage,
                },
              },
            });
          }
          break;
        }
        case 'end': {
          Navigation.showModal({
            component: {
              id: 'endScreen',
              name: 'avalon.EndScreen',
              options: {
                modalTransitionStyle: 'crossDissolve',
                modalPresentationStyle: 'overCurrentContext',
              },
              passProps: {
                message: this.assassinationWaitMessage,
              },
            },
          });
          break;
        }
      }
    }
  }

  watchPlayersHandler = () => {
    let commanderButtonText = this.isPlayerCommander() ? 'Confirm' : 'Got it';
    let modalId = this.isPlayerCommander()
      ? 'questChoiceScreen'
      : 'playersScreen';
    Navigation.showModal({
      component: {
        id: modalId,
        name: 'avalon.PlayersScreen',
        options: {
          modalTransitionStyle: 'crossDissolve',
          modalPresentationStyle: 'overCurrentContext',
        },
        passProps: {
          isPlayerCommander: this.isPlayerCommander(),
          buttonText: commanderButtonText,
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
    // backgroundColor: 'white',
  },
  questsList: {
    height: hp('28%'),
    // backgroundColor: 'red',
  },
  votingsList: {
    width: wp('90%'),
    height: wp('20%'),
    marginHorizontal: wp('2%'),
    // marginTop: hp('-2%'),
    // backgroundColor: 'purple',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('2%'),
    // backgroundColor: 'yellow',
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
    // backgroundColor: 'blue',
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
    questScores: state.game.questScores,
    questResult: state.game.questResult,
    assassinatedPlayer: state.game.assassinatedPlayer,
    assassinationResult: state.game.assassinationResult,
  };
};

export default connect(mapStateToProps)(BoardScreen);
