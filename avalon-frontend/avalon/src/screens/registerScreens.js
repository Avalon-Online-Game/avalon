import {Navigation} from 'react-native-navigation';
import {Provider} from 'react-redux';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import EntranceScreen from './Entrance/Entrance';
import AuthScreen from './Entrance/Auth';
import WelcomeScreen from './Main/Welcome';
import AvatarsList from '../components/Main/AvatarsList';
import ConfirmOverlay from '../components/Main/ConfirmOverlay';
import MainMenuScreen from './Main/MainMenu';
import JoinGameScreen from './Main/JoinGame';
import CreateGameScreen from './Main/CreateGame';
import RolesList from '../components/CreateGame/RolesList';
import ChosenRolesList from '../components/CreateGame/ChosenRolesList';
import ShareGameCodeScreen from './Main/ShareGame';
import QuestsList from '../components/Game/QuestsList';
import VotingsList from '../components/Game/VotingsList';
import BoardScreen from './Game/Board';
import LoadingScreen from './Game/Loading';
import InterruptOverlay from '../components/Game/InterruptOverlay';
import RoleScreen from './Game/Role';
import PlayersScreen from './Game/Players';
import VoteScreen from './Game/Vote';
import WaitingScreen from './Game/Waiting';
import VoteResultScreen from './Game/VoteResult';
import QuestScreen from './Game/Quest';
import QuestResultScreen from './Game/QuestResult';
import AssassinationScreen from './Game/Assassination';
import AssassinationConfirmationScreen from './Game/AssassinationConfirmation';
import EndScreen from './Game/End';

import configureStore from '../store/configureStore';

const store = configureStore();

export const registerScreens = () => {
  Navigation.registerComponent('avalon.EntranceScreen', () => EntranceScreen);
  Navigation.registerComponent('avalon.AuthScreen', () => AuthScreen);
  Navigation.registerComponentWithRedux(
    'avalon.WelcomeScreen',
    () => WelcomeScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.AvatarsList',
    () => AvatarsList,
    Provider,
    store,
  );
  Navigation.registerComponent('avalon.ConfirmScreen', () => ConfirmOverlay);
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
  Navigation.registerComponent(
    'avalon.InterruptScreen',
    () => InterruptOverlay,
  );
  Navigation.registerComponentWithRedux(
    'avalon.QuestsList',
    () => QuestsList,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.VotingsList',
    () => VotingsList,
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
  Navigation.registerComponentWithRedux(
    'avalon.VoteScreen',
    () => VoteScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.WaitingScreen',
    () => WaitingScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.VoteResultScreen',
    () => VoteResultScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.QuestScreen',
    () => QuestScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.QuestResultScreen',
    () => QuestResultScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.AssassinationScreen',
    () => AssassinationScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.AssassinationConfirmationScreen',
    () => AssassinationConfirmationScreen,
    Provider,
    store,
  );
  Navigation.registerComponentWithRedux(
    'avalon.EndScreen',
    () => EndScreen,
    Provider,
    store,
  );

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
      setStackRoot: {
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
    },
  });
};
