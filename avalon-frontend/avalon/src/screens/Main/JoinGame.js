import React, {Component} from 'react';
import {View, Text, TextInput, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';

import MainView from '../../components/UI/Main/MainView';
import BottomButton from '../../components/UI/Main/BottomButton';
import API from '../../utils/API';
import {goLoading} from './navigation';
import DefaultColors from '../../components/UI/colors';
import {showLongBottomToast} from '../../utils/toasts';

class JoinGameScreen extends Component {
  constructor() {
    super();
    this.state = {
      code: '',
    };
  }

  inputNumber = (number, index) => {
    const code =
      this.state.code.slice(0, index - 1) +
      number +
      this.state.code.slice(index);
    this.setState({
      code: code,
    });
    if (number.length > 0) {
      switch (index) {
        case 1:
          this.input_2.focus();
          break;
        case 2:
          this.input_3.focus();
          break;
        case 3:
          this.input_4.focus();
          break;
        default:
          break;
      }
    }
  };

  joinHandler = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${user.key}`,
    };
    API.post(
      'players/',
      {
        game: this.state.code.toString(),
      },
      {
        headers: headers,
      },
    )
      .then(res => {
        AsyncStorage.multiSet([
          ['game', JSON.stringify(res.data.game.code)],
          ['player', JSON.stringify(res.data.token)],
        ]).then(goLoading());
      })
      .catch(err => {
        if (err.response.status === 404) {
          console.log('Game code is not correct: 404');
          showLongBottomToast('Entered game code is wrong');
        }
        if (err.response.status === 406) {
          console.log('Game is full: 406');
          showLongBottomToast('Game is out of capacity');
        }
        if (err.response.status === 400) {
          console.log(`${JSON.stringify(err.response.data)}: 400`);
          showLongBottomToast('Whoops... something went wrong!');
        }
      });
  };

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.text}>Enter the invitation code</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref={ref => (this.input_1 = ref)}
            style={styles.textInput}
            maxLength={1}
            value={this.state.firstChar}
            onChangeText={value => this.inputNumber(value, 1)}
          />
          <TextInput
            ref={ref => (this.input_2 = ref)}
            style={styles.textInput}
            maxLength={1}
            value={this.state.secondChar}
            onChangeText={value => this.inputNumber(value, 2)}
          />
          <TextInput
            ref={ref => (this.input_3 = ref)}
            style={styles.textInput}
            maxLength={1}
            value={this.state.thirdChar}
            onChangeText={value => this.inputNumber(value, 3)}
          />
          <TextInput
            ref={ref => (this.input_4 = ref)}
            style={styles.textInput}
            maxLength={1}
            value={this.state.forthChar}
            onChangeText={value => this.inputNumber(value, 4)}
          />
        </View>
        <BottomButton
          disabled={this.state.code.length < 4}
          onPress={this.joinHandler}>
          Join
        </BottomButton>
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  text: {
    color: DefaultColors.light,
    fontSize: wp('6%'),
    marginTop: hp('1%'),
    fontFamily: 'JosefinSans-Medium',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: hp('55%'),
  },
  textInput: {
    backgroundColor: '#17242c',
    width: wp('15%'),
    height: wp('15%'),
    fontSize: wp('7%'),
    marginHorizontal: wp('2.5%'),
    color: DefaultColors.light,
    textAlign: 'center',
  },
});

export default JoinGameScreen;
