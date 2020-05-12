import React, {Component} from 'react';
import {View, Text, Image, ImageBackground, StyleSheet} from 'react-native';
import {Overlay} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

class QuestResultScreen extends Component {
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
          source={require('../../assets/popups/popup-back.png')}
          resizeMode="contain">
          <Text style={styles.titleText}>Quest Result</Text>
          <Text style={styles.mainText}>{this.props.message}</Text>
          <Image
            style={styles.crownImage}
            source={require('../../assets/popups/crown.png')}
            resizeMode="contain"
          />
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
    backgroundColor: '#000000A0',
  },
  overlayStyle: {
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
    color: '#e2d7aa',
    fontSize: wp('10%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  mainText: {
    color: '#e2d7aa',
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

export default connect(mapStateToProps)(QuestResultScreen);
