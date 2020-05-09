import React, {Component} from 'react';
import {
  Image,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {Overlay} from 'react-native-elements';

import DefaultButton from '../../components/UI/Game/DefultButton';
import avatars from '../../utils/avatars';
import {startGame, wsConnect, wsDisconnect} from '../../store/actions/index';

class PlayersScreen extends Component {
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

  playerRenderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback style={styles.userButtonContainer}>
        <View style={styles.userButton}>
          <Image
            source={
              avatars.find(avatar => avatar.id === item.avatar.toString()).image
            }
            style={styles.userImage}
            resizeMode="contain"
          />
          <Text style={styles.userText}>{item.username}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
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
          <FlatList
            style={styles.list}
            data={this.props.players}
            renderItem={this.playerRenderItem}
            keyExtractor={item => item.token}
            numColumns={2}
          />
          <DefaultButton style={styles.button} onPress={this.dissmissHandler}>
            OK
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
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('-4%'),
    width: wp('60%'),
  },
  // buttonImage: {
  //   width: wp('60%'),
  //   height: hp('8%'),
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  // buttonText: {
  //   color: '#0B161C',
  //   fontSize: wp('6%'),
  //   textAlign: 'center',
  //   textAlignVertical: 'center',
  //   fontFamily: 'JosefinSans-Bold',
  // },
  userButtonContainer: {},
  userButton: {
    width: wp('20%'),
    marginTop: hp('2%'),
    marginHorizontal: wp('5%'),
    alignItems: 'center',
  },
  userImage: {
    width: wp('18%'),
    height: wp('18%'),
  },
  userText: {
    color: '#e2d7aa',
    fontSize: wp('4%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Light',
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
)(PlayersScreen);
