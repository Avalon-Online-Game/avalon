import React, {Component} from 'react';
import {View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {Navigation} from 'react-native-navigation';

import {
  wsConnect,
  wsDisconnect,
  setPlayerToken,
  wsSend,
} from '../../store/actions/index';
import {
  showLeave,
  showPlayerLeft,
  goMainMenu,
  goBoard,
} from '../../utils/navigation';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
    Navigation.events().bindComponent(this);
  }

  navigationButtonPressed({buttonId}) {
    switch (buttonId) {
      case 'leaveButton': {
        const confirmFunction = () => {
          const msg = {
            msg_type: 'leave',
          };
          this.props.wsSend(msg);
          AsyncStorage.multiRemove(['game', 'player']);
          goMainMenu();
        };
        showLeave(confirmFunction);
        break;
      }
    }
  }

  componentDidMount() {
    AsyncStorage.getItem('player').then(token => {
      this.props.setPlayerToken(JSON.parse(token));
      this.props.wsConnect(JSON.parse(token));
    });
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.leftPlayers.length !== this.props.leftPlayers.length) {
      showPlayerLeft(this.props.leftPlayers[this.props.leftPlayers.length - 1]);
      return;
    }
    if (prevProps.gameState !== this.props.gameState) {
      goBoard();
      return;
    }
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.mainText}>
          Waiting for other players to join the game...
        </Text>
        <ImageBackground
          style={styles.innerBackgroundImage}
          resizeMode="contain"
          source={require('../../assets/loading/waiting-castle-back.png')}>
          <Image
            style={styles.innerImage}
            resizeMode="contain"
            source={require('../../assets/loading/castle.png')}
          />
        </ImageBackground>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    backgroundColor: '#0B161C',
    width: wp('100%'),
    height: hp('100%'),
  },
  mainText: {
    color: '#e2d7aa',
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('5%'),
  },
  innerBackgroundImage: {
    width: wp('80%'),
    height: wp('80%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('5%'),
  },
  innerImage: {
    width: wp('50%'),
    height: wp('50%'),
  },
});

const mapStateToProps = state => {
  return {
    gameState: state.game.gameState,
    leftPlayers: state.game.leftPlayers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    wsConnect: token => dispatch(wsConnect(token)),
    wsDisconnect: () => dispatch(wsDisconnect()),
    setPlayerToken: token => dispatch(setPlayerToken(token)),
    wsSend: msg => dispatch(wsSend(msg)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadingScreen);
