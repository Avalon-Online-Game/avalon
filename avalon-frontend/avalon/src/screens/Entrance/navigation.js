import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {widthPercentageToDP as wp} from 'react-native-responsive-screen';

import DefaultColors from '../../components/UI/colors';

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
  // const settingsIcon = await Icon.getImageSource('ios-settings', wp('8%'));
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
                      // rightButtons: [
                      //   {
                      //     id: 'settingsButton',
                      //     icon: settingsIcon,
                      //     color: DefaultColors.light,
                      //   },
                      // ],
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
