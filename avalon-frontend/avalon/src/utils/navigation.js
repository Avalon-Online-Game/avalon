import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import DefaultColors from '../components/UI/colors';

export const goAuth = () => {
  Navigation.setRoot({
    root: {
      component: {
        id: 'authScreen',
        name: 'avalon.AuthScreen',
      },
    },
  });
};

export const goWelcome = username => {
  Navigation.setRoot({
    root: {
      component: {
        id: 'welcomeScreen',
        name: 'avalon.WelcomeScreen',
        passProps: {
          username: username,
        },
      },
    },
  });
};

export const goMainMenu = async () => {
  const backIcon = await Icon.getImageSource('ios-arrow-back', wp('8%'));
  const logoutIcon = await Icon.getImageSource('ios-log-out', wp('8%'));
  const settingsIcon = await Icon.getImageSource('ios-settings', wp('8%'));
  Navigation.setRoot({
    root: {
      sideMenu: {
        center: {
          stack: {
            id: 'mainStack',
            children: [
              {
                component: {
                  id: 'mainMenuScreen',
                  name: 'avalon.MainMenuScreen',
                  options: {
                    topBar: {
                      leftButtons: [
                        {
                          id: 'logoutButton',
                          icon: logoutIcon,
                          color: DefaultColors.light,
                        },
                      ],
                      rightButtons: [
                        {
                          id: 'settingsButton',
                          icon: settingsIcon,
                          color: DefaultColors.light,
                        },
                      ],
                    },
                  },
                },
              },
            ],
            options: {
              topBar: {
                backButton: {
                  icon: backIcon,
                  color: DefaultColors.light,
                },
              },
            },
          },
        },
      },
    },
  });
};

export const goLoading = async () => {
  const backIcon = await Icon.getImageSource('ios-arrow-back', wp('8%'));
  Navigation.setRoot({
    root: {
      stack: {
        id: 'mainStack',
        children: [
          {
            component: {
              id: 'loadingScreen',
              name: 'avalon.LoadingScreen',
              options: {
                topBar: {
                  leftButtons: [
                    {
                      id: 'leaveButton',
                      icon: backIcon,
                      color: DefaultColors.light,
                    },
                  ],
                },
              },
            },
          },
        ],
        options: {
          topBar: {
            backButton: {
              icon: backIcon,
              color: DefaultColors.light,
            },
          },
        },
      },
    },
  });
};

export const goBoard = async () => {
  const logoutIcon = await Icon.getImageSource('ios-log-out', wp('8%'));
  const settingsIcon = await Icon.getImageSource('ios-settings', wp('8%'));
  Navigation.setStackRoot('mainStack', {
    component: {
      id: 'boardScreen',
      name: 'avalon.MainBoardScreen',
      options: {
        topBar: {
          leftButtons: [
            {
              id: 'leaveButton',
              icon: logoutIcon,
              color: DefaultColors.light,
            },
          ],
          rightButtons: [
            {
              id: 'settingsButton',
              icon: settingsIcon,
              color: DefaultColors.light,
            },
          ],
        },
      },
    },
  });
};

export const showRole = () => {
  Navigation.showModal({
    component: {
      id: 'roleScreen',
      name: 'avalon.RoleScreen',
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
    },
  });
};

export const showVotingWait = () => {
  Navigation.showModal({
    component: {
      id: 'votingWaitScreen',
      name: 'avalon.WaitingScreen',
      passProps: {
        message: 'other players are voting',
      },
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
    },
  });
};

export const pushVote = componentId => {
  Navigation.push(componentId, {
    component: {
      id: 'voteScreen',
      name: 'avalon.VoteScreen',
    },
  });
};

export const showQuestWait = () => {
  Navigation.showModal({
    component: {
      id: 'questWaitScreen',
      name: 'avalon.WaitingScreen',
      passProps: {
        message: 'heroes are in quest',
      },
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
    },
  });
};

export const showVotingResult = () => {
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
};

export const pushQuest = componentId => {
  Navigation.push(componentId, {
    component: {
      id: 'questScreen',
      name: 'avalon.QuestScreen',
    },
  });
};

export const showQuestResult = () => {
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
};

export const showAssassination = () => {
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
};

export const showAssassinationWait = () => {
  Navigation.showModal({
    component: {
      id: 'assassinationWaitScreen',
      name: 'avalon.WaitingScreen',
      passProps: {
        message: 'assassin is choosing a player',
      },
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
    },
  });
};

export const showEnd = () => {
  Navigation.showModal({
    component: {
      id: 'endScreen',
      name: 'avalon.EndScreen',
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
    },
  });
};

export const showLeave = confirmFunction => {
  Navigation.showModal({
    component: {
      id: 'leaveScreen',
      name: 'avalon.ConfirmScreen',
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        message: 'Are you sure you want to leave the game?',
        confirmFunction: confirmFunction,
      },
    },
  });
};

export const showPlayerLeft = player => {
  Navigation.showModal({
    component: {
      id: 'playerLeftScreen',
      name: 'avalon.InterruptScreen',
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        message: `Game Over \n ${player.username} left the game..`,
        buttonText: 'Ok',
      },
    },
  });
};

export const showPlayerDisconnected = player => {
  Navigation.showModal({
    component: {
      id: 'playerDisconnectedScreen',
      name: 'avalon.InterruptScreen',
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        message: 'Waiting.. One of the players connection has lost..',
        buttonText: 'Leave',
      },
    },
  });
};

export const dissmissPlayerDisconnected = () => {
  Navigation.dismissModal('playerDisconnectedScreen');
};
