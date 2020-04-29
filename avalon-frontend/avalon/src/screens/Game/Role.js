import React, {Component} from 'react';
import {View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import RoleDataList from '../../components/Game/RoleDataList';
import {
  updateGameState,
  wsConnect,
  wsDisconnect,
} from '../../store/actions/index';

class RoleScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    AsyncStorage.getItem('player').then(token => {
      console.log(JSON.parse(token));
      this.props.wsConnect(JSON.parse(token));
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.role}>
          <Text style={styles.roleText}>You are</Text>
          <Image
            style={styles.roleImage}
            resizeMode="contain"
            source={require('../../assets/goods/merlin.png')}
          />
          <Text style={styles.roleText}>{this.props.role}</Text>
        </View>
        <RoleDataList role={this.props.role} roleData={this.props.roleData} />
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
  role: {
    color: '#e2d7aa',
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('5%'),
  },
  roleText: {
    color: '#e2d7aa',
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('5%'),
  },
  roleImage: {
    color: '#e2d7aa',
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('5%'),
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
    updateGameState: data => dispatch(updateGameState(data)),
    wsConnect: token => dispatch(wsConnect(token)),
    wsDisconnect: () => dispatch(wsDisconnect()),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoleScreen);
