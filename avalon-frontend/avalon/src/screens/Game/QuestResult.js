import React, {Component} from 'react';
import {View, Text, ImageBackground, Image, StyleSheet} from 'react-native';
import {Overlay} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
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
    let title = `Quest ${this.props.currentQuestNumber - 1} ${
      this.props.questResult === 'success' ? 'Succeed' : 'Failed'
    }!`;
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
          <Text
            style={[
              styles.titleText,
              this.props.questResult === 'success'
                ? styles.successColor
                : styles.failColor,
            ]}>
            {title}
          </Text>
          <View style={styles.scoreContainer}>
            <View style={styles.successScoresContainer}>
              <Text style={styles.scoreNumber}>
                {this.props.questScores.success}
              </Text>
              <View style={styles.successScore}>
                <Image
                  style={styles.scoreImage}
                  source={require('../../assets/popups/success.png')}
                  resizeMode="contain"
                />
                <Text style={styles.scoreText}>Success</Text>
              </View>
            </View>
            <View style={styles.failScoresContainer}>
              <Text style={styles.scoreNumber}>
                {this.props.questScores.fail}
              </Text>
              <View style={styles.failScore}>
                <Image
                  style={styles.scoreImage}
                  source={require('../../assets/popups/fail.png')}
                  resizeMode="contain"
                />
                <Text style={styles.scoreText}>Fail</Text>
              </View>
            </View>
          </View>
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
    fontSize: wp('9%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  successColor: {
    color: '#4c644c',
  },
  failColor: {
    color: '#743c34',
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: 'white',
  },
  successScoresContainer: {
    // marginHorizontal: wp('5%'),
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('30%'),
    // backgroundColor: 'green',
  },
  scoreNumber: {
    color: '#e2d7aa',
    fontSize: wp('15%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  successScore: {
    flexDirection: 'row',
    // marginTop: hp('2%'),
  },
  scoreImage: {
    width: wp('10%'),
    height: wp('10%'),
    marginHorizontal: wp('1%'),
  },
  scoreText: {
    color: '#e2d7aa',
    fontSize: wp('5%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  failScoresContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('30%'),
  },
  failScore: {
    flexDirection: 'row',
    // marginTop: hp('2%'),
  },
});

const mapStateToProps = state => {
  return {
    gameState: state.game.gameState,
    questResult: state.game.questResult,
    questScores: state.game.questScores,
    currentQuestNumber: state.game.currentQuestNumber,
  };
};

export default connect(mapStateToProps)(QuestResultScreen);
