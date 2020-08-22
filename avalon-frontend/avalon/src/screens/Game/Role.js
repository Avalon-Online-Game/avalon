import React, {Component} from 'react';
import {Text, Image, StyleSheet, ImageBackground, View} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import RoleDataList from '../../components/Game/RoleDataList';
import DefaultButton from '../../components/UI/Game/DefultButton';
import {startGame, wsConnect, wsDisconnect} from '../../store/actions/index';
import DefaultColors from '../../components/UI/colors';

class RoleScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  dissmissHandler = () => {
    Navigation.dismissModal(this.props.componentId);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <View>
        <Modal
          style={styles.overlay}
          isVisible={this.state.visible}
          backdropTransitionOutTiming={0}>
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
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('70%'),
  },
  titleText: {
    color: DefaultColors.light,
    fontSize: wp('6%'),
    textAlign: 'center',
    marginTop: hp('5%'),
    fontFamily: 'JosefinSans-Regular',
  },
  roleText: {
    color: DefaultColors.light,
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
  },
  buttonImage: {
    width: wp('60%'),
    height: hp('8%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: DefaultColors.dark,
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
