import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import MainView from '../../components/UI/Main/MainView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {wsSend} from '../../store/actions/index';
import DefaultColors from '../../components/UI/colors';

class VoteScreen extends Component {
  constructor(props) {
    super(props);
    this.questTitle = `Quest ${this.props.currentQuestNumber}`;
  }

  successHandler = () => {
    const msg = {
      msg_type: 'quest',
      score: 'success',
    };
    this.props.wsSend(msg);
    Navigation.pop(this.props.componentId);
  };

  failHandler = () => {
    const msg = {
      msg_type: 'quest',
      score: 'fail',
    };
    this.props.wsSend(msg);
    Navigation.pop(this.props.componentId);
  };

  voteButtons = () => {
    if (this.props.role.side === 'evil') {
      return (
        <View style={styles.buttonContainer}>
          <DefaultButton
            buttonStyle={styles.button}
            backgroundStyle={styles.buttonBackground}
            onPress={this.successHandler}>
            Success
          </DefaultButton>
          <DefaultButton
            buttonStyle={styles.button}
            backgroundStyle={styles.buttonBackground}
            onPress={this.failHandler}>
            Fail
          </DefaultButton>
        </View>
      );
    }
    return (
      <View style={styles.buttonContainer}>
        <DefaultButton
          buttonStyle={styles.button}
          backgroundStyle={styles.buttonBackground}
          onPress={this.successHandler}>
          Success
        </DefaultButton>
      </View>
    );
  };

  render() {
    return (
      <MainView>
        <Text style={styles.questTitle}>{this.questTitle}</Text>
        <Text style={styles.mainText}>Choose your quest result</Text>
        {this.voteButtons()}
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  questTitle: {
    color: DefaultColors.light,
    fontSize: wp('7%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('3%'),
  },
  mainText: {
    marginTop: hp('10%'),
    color: DefaultColors.light,
    fontSize: wp('6%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  buttonContainer: {
    marginTop: hp('25%'),
  },
  button: {
    marginTop: hp('2%'),
  },
  buttonBackground: {
    width: wp('80%'),
  },
});

const mapStateToProps = state => {
  return {
    commander: state.game.commander,
    currentQuestNumber: state.game.currentQuestNumber,
    gameState: state.game.gameState,
    questChosenPlayers: state.game.questChosenPlayers,
    role: state.game.role,
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
)(VoteScreen);
