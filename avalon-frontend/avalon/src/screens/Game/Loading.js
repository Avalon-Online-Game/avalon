import React, {Component} from 'react';
import {View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';

import {
  startGame,
  wsConnect,
  wsDisconnect,
  setPlayerToken,
} from '../../store/actions/index';

class LoadingScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    AsyncStorage.getItem('player').then(token => {
      this.props.setPlayerToken(JSON.parse(token));
      this.props.wsConnect(JSON.parse(token));
    });
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
    commander: state.game.commander,
    questNumber: state.game.questNumber,
    players: state.game.players,
    numberOfPlayers: state.game.numberOfPlayers,
    role: state.game.role,
    roleData: state.game.roleData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    startGame: data => dispatch(startGame(data)),
    wsConnect: token => dispatch(wsConnect(token)),
    wsDisconnect: () => dispatch(wsDisconnect()),
    setPlayerToken: token => dispatch(setPlayerToken(token)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LoadingScreen);
