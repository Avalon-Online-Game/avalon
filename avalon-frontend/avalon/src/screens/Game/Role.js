import React, {Component} from 'react';
import {Text, Image, StyleSheet, ImageBackground} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {Overlay} from 'react-native-elements';

import RoleDataList from '../../components/Game/RoleDataList';
import DefaultButton from '../../components/UI/Game/DefultButton';
import {startGame, wsConnect, wsDisconnect} from '../../store/actions/index';
import color from '../../components/UI/colors';

class RoleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  dissmissHandler = () => {
    this.setState({
      visible: false,
    });
    Navigation.dismissModal(this.props.componentId);
  };

  render() {
    return (
      <Overlay
        backdropStyle={styles.backdrop}
        onBackdropPress={this.dissmissHandler}
        isVisible={this.state.visible}
        overlayStyle={styles.overlayStyle}>
        <ImageBackground
          style={styles.background}
          source={require('../../assets/popups/modal-back.png')}
          resizeMode="contain">
          <Text style={styles.titleText}>You are</Text>
          <Image
            style={styles.roleImage}
            resizeMode="contain"
            source={this.props.role.image}
          />
          <Text style={styles.roleText}>{this.props.role.text}</Text>
          <RoleDataList
            data={this.props.roleData}
            style={styles.roleDataList}
          />
          <DefaultButton style={styles.button} onPress={this.dissmissHandler}>
            Got it
          </DefaultButton>
        </ImageBackground>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000D0',
  },
  overlayStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  background: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('70%'),
    backgroundColor: 'transparent',
  },
  titleText: {
    color: color.light,
    fontSize: wp('6%'),
    textAlign: 'center',
    marginTop: hp('5%'),
    fontFamily: 'JosefinSans-Regular',
  },
  roleText: {
    color: color.light,
    fontSize: wp('8%'),
    textAlign: 'center',
    marginTop: hp('-7%'),
    fontFamily: 'JosefinSans-Regular',
  },
  roleImage: {
    marginTop: hp('-5%'),
  },
  roleDataList: {},
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('-4%'),
    width: wp('60%'),
    // backgroundColor: 'red',
  },
  buttonImage: {
    width: wp('60%'),
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'green',
  },
  buttonText: {
    color: color.dark,
    fontSize: wp('6%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Bold',
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
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RoleScreen);
