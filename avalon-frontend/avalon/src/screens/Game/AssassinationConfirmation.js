import React, {Component} from 'react';
import {
  View,
  Text,
  TouchableWithoutFeedback,
  Image,
  StyleSheet,
} from 'react-native';
import {Overlay} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import avatars from '../../utils/avatars';
import {wsSend} from '../../store/actions/index';
import DefaultColors from '../../components/UI/colors';

class AssassinationConfirmationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  acceptHandler = () => {
    const msg = {
      msg_type: 'assassination',
      merlin_choice: this.props.player,
    };
    this.props.wsSend(msg);
    this.setState(
      {
        visible: false,
      },
      async () => {
        await Navigation.dismissAllModals();
      },
    );
  };

  declineHandler = () => {
    this.setState(
      {
        visible: false,
      },
      async () => {
        await Navigation.dismissModal(this.props.componentId);
      },
    );
  };

  render() {
    return (
      <Overlay
        backdropStyle={styles.backdrop}
        // onBackdropPress={this.dissmissHandler}
        isVisible={this.state.visible}
        overlayStyle={styles.overlayStyle}>
        <View>
          <Text style={styles.titleText}>Are you sure?</Text>
          <View style={styles.confirmationContainer}>
            <TouchableWithoutFeedback
              style={styles.confirmButton}
              onPress={this.acceptHandler}>
              <Image
                style={styles.confirmImage}
                source={require('../../assets/popups/yes.png')}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
            <View style={styles.playerContainer}>
              <Image
                style={styles.playerImage}
                source={
                  avatars.find(
                    avatar => avatar.id === this.props.player.avatar.toString(),
                  ).image
                }
                resizeMode="contain"
              />
              <Text style={styles.playerText} />
            </View>
            <TouchableWithoutFeedback
              style={styles.confirmButton}
              onPress={this.declineHandler}>
              <Image
                style={styles.confirmImage}
                source={require('../../assets/popups/no.png')}
                resizeMode="contain"
              />
            </TouchableWithoutFeedback>
          </View>
        </View>
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000DF',
  },
  overlayStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  titleText: {
    color: DefaultColors.light,
    fontSize: wp('10%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  confirmationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  confirmButton: {
    width: wp('20%'),
    height: wp('20%'),
    // marginHorizontal: wp('5%'),
  },
  confirmImage: {
    width: wp('20%'),
    height: wp('20%'),
    marginHorizontal: wp('5%'),
  },
  playerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerImage: {
    width: wp('30%'),
    height: wp('30%'),
  },
  playerText: {
    color: DefaultColors.light,
    fontSize: wp('6%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
});

const mapStateToProps = state => {
  return {
    gameState: state.game.gameState,
    questVotingResult: state.game.questVotingResult,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    wsSend: msg => dispatch(wsSend(msg)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AssassinationConfirmationScreen);
