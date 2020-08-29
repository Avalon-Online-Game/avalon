import React, {Component} from 'react';
import {View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import DefaultColors from '../../components/UI/colors';

class WaitingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  componentDidMount() {
    if (this.props.gameState === 'day') {
      this.dissmissHandler();
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.gameState !== prevProps.gameState) {
      this.dissmissHandler();
    }
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
          isVisible={this.state.visible}
          style={styles.overlay}
          backdropTransitionOutTiming={0}>
          <ImageBackground
            style={styles.background}
            source={require('../../assets/popups/popup-back.png')}
            resizeMode="contain">
            <Text style={styles.titleText}>Waiting...</Text>
            <Text style={styles.mainText}>{this.props.message}</Text>
            <Image
              style={styles.crownImage}
              source={require('../../assets/popups/crown.png')}
              resizeMode="contain"
            />
          </ImageBackground>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000A0',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('40%'),
    backgroundColor: 'transparent',
  },
  titleText: {
    color: DefaultColors.light,
    fontSize: wp('10%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  mainText: {
    color: DefaultColors.light,
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Regular',
    marginTop: hp('2%'),
  },
  crownImage: {
    width: wp('12%'),
    height: wp('12%'),
    marginTop: hp('3%'),
  },
});

const mapStateToProps = state => {
  return {
    gameState: state.game.gameState,
    questVotingResult: state.game.questVotingResult,
  };
};

export default connect(mapStateToProps)(WaitingScreen);
