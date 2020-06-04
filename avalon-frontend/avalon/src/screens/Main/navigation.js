import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

import {goAuth} from '../Entrance/navigation';
import DefaultColors from '../../components/UI/colors';

export const showLogout = () => {
  Navigation.showModal({
    component: {
      id: 'logoutScreen',
      name: 'avalon.ConfirmScreen',
      options: {
        modalTransitionStyle: 'crossDissolve',
        modalPresentationStyle: 'overCurrentContext',
      },
      passProps: {
        message: 'Are you sure you want to logout?',
        confirmFunction: () => {
          AsyncStorage.removeItem('user');
          goAuth();
        },
      },
    },
  });
};

export const pushCreateGame = () => {
  Navigation.push('mainStack', {
    component: {
      id: 'createGameScreen',
      name: 'avalon.CreateGameScreen',
    },
  });
};

export const pushJoinGame = () => {
  Navigation.push('mainStack', {
    component: {
      id: 'joinGameScreen',
      name: 'avalon.JoinGameScreen',
    },
  });
};

export const pushShareGame = async () => {
  Navigation.push('mainStack', {
    component: {
      id: 'shareGameScreen',
      name: 'avalon.ShareGameCodeScreen',
      passProps: {
        gameCode: await AsyncStorage.getItem('game').then(gameCode =>
          JSON.parse(gameCode),
        ),
      },
      options: {
        topBar: {
          backButton: {
            visible: false,
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
