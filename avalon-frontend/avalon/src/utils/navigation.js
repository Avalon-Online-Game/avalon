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

export const goMainMenu = () => {
  Promise.all([
    Icon.getImageSource('ios-arrow-back', wp('8%')),
    Icon.getImageSource('ios-log-out', wp('8%')),
  ]).then(icons => {
    Navigation.setRoot({
      root: {
        stack: {
          id: 'main',
          children: [
            {
              component: {
                id: 'mainMenuScreen',
                name: 'avalon.MainMenuScreen',
              },
            },
          ],
          options: {
            topBar: {
              leftButtons: [
                {
                  id: 'logOutButton',
                  icon: icons[1],
                  color: '#e2d7aa',
                  showAsAction: 'ifRoom',
                },
              ],
              backButton: {
                icon: icons[0],
                color: '#e2d7aa',
                visible: true,
              },
            },
          },
        },
      },
    });
  });
};

export const goLoading = () => {
  Navigation.setRoot({
    root: {
      stack: {
        id: 'main',
        children: [
          {
            component: {
              id: 'loadingScreen',
              name: 'avalon.LoadingScreen',
            },
          },
        ],
      },
    },
  });
};
