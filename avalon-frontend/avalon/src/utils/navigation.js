import {Navigation} from 'react-native-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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

export const goWelcome = () => {
  Navigation.setRoot({
    root: {
      component: {
        id: 'welcomeScreen',
        name: 'avalon.WelcomeScreen',
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
                          color: '#e2d7aa',
                        },
                      ],
                      rightButtons: [
                        {
                          id: 'settingsButton',
                          icon: settingsIcon,
                          color: '#e2d7aa',
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
                  color: '#e2d7aa',
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
                      color: '#e2d7aa',
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
              color: '#e2d7aa',
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
              id: 'logoutButton',
              icon: logoutIcon,
              color: '#e2d7aa',
            },
          ],
          rightButtons: [
            {
              id: 'settingsButton',
              icon: settingsIcon,
              color: '#e2d7aa',
            },
          ],
        },
      },
    },
  });
};
