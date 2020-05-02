import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';

import EntranceScreen from './src/screens/Entrance/Entrance';
import AuthScreen from './src/screens/Entrance/Auth';
import WelcomeScreen from './src/screens/Main/Welcome';
import MainMenuScreen from './src/screens/Main/MainMenu';
import JoinGameScreen from './src/screens/Main/JoinGame';
import CreateGameScreen from './src/screens/Main/CreateGame';
import RolesList from './src/components/CreateGame/RolesList';
import ChosenRolesList from './src/components/CreateGame/ChosenRolesList';
import ShareGameCodeScreen from './src/screens/Main/ShareGame';
import BoardScreen from './src/screens/Game/Board';
import LoadingScreen from './src/screens/Game/Loading';
import RoleScreen from './src/screens/Game/Role';
import PlayersScreen from './src/screens/Game/Players';

import configureStore from './src/store/configureStore';

const store = configureStore();

// Register screens
Navigation.registerComponent('avalon.EntranceScreen', () => EntranceScreen);
Navigation.registerComponent('avalon.AuthScreen', () => AuthScreen);
Navigation.registerComponent('avalon.WelcomeScreen', () => WelcomeScreen);
Navigation.registerComponent('avalon.MainMenuScreen', () => MainMenuScreen);
Navigation.registerComponent('avalon.JoinGameScreen', () => JoinGameScreen);
Navigation.registerComponentWithRedux(
  'avalon.CreateGameScreen',
  () => CreateGameScreen,
  Provider,
  store,
);
Navigation.registerComponentWithRedux(
  'avalon.RoleList',
  () => RolesList,
  Provider,
  store,
);
Navigation.registerComponentWithRedux(
  'avalon.GameRoleList',
  () => ChosenRolesList,
  Provider,
  store,
);
Navigation.registerComponent(
  'avalon.ShareGameCodeScreen',
  () => ShareGameCodeScreen,
);
Navigation.registerComponentWithRedux(
  'avalon.LoadingScreen',
  () => LoadingScreen,
  Provider,
  store,
);
Navigation.registerComponentWithRedux(
  'avalon.MainBoardScreen',
  () => BoardScreen,
  Provider,
  store,
);
Navigation.registerComponentWithRedux(
  'avalon.RoleScreen',
  () => RoleScreen,
  Provider,
  store,
);
Navigation.registerComponentWithRedux(
  'avalon.PlayersScreen',
  () => PlayersScreen,
  Provider,
  store,
);

Promise.all([Icon.getImageSource('ios-arrow-back', wp('8%'))]).then(icons => {
  Navigation.setDefaultOptions({
    animations: {
      setRoot: {
        waitForRender: true,
      },
      put: {
        waitForRender: true,
      },
      push: {
        waitForRender: true,
      },
    },
    topBar: {
      animate: true,
      title: {
        text: 'AVALON',
        color: '#e2d7aa',
        fontSize: hp('4.5%'),
        fontFamily: 'JosefinSans-Bold',
        alignment: 'center',
      },
      height: hp('8%'),
      background: {
        color: '#0b161c',
      },
      backButton: {
        icon: icons[0],
        color: '#e2d7aa',
      },
    },
  });
});

Navigation.events().registerAppLaunchedListener(() => {
  Navigation.setRoot({
    root: {
      component: {
        name: 'avalon.EntranceScreen',
      },
    },
  });
});
