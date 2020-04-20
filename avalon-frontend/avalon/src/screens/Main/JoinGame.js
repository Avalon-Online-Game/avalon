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

class JoinGameScreen extends Component {
  constructor() {
    super();
    this.state = {
      firstChar: '',
      secondChar: '',
      thirdChar: '',
      forthChar: '',
    };
  }

  joinHandler = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${user.key}`,
    };
    let code = this.state.firstChar.concat(
      this.state.secondChar,
      this.state.thirdChar,
      this.state.forthChar,
    );
    API.post(
      'players/',
      {
        game: code.toString(),
      },
      {
        headers: headers,
      },
    )
      .then(async res => {
        AsyncStorage.setItem('player', JSON.stringify(res.data));
      })
      .catch(err => {
        if (err.response.status == 404) {
          alert('Game code is not correct');
        }
      });
  };

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.text}>Enter the invitation code</Text>
        <View style={styles.inputContainer}>
          <TextInput
            ref="input_1"
            style={styles.textInput}
            maxLength={1}
            value={this.state.firstChar}
            onChangeText={async value => {
              await this.setState({
                firstChar: value,
              });
              if (this.state.firstChar.length > 0) {
                this.refs.input_2.focus();
              }
            }}
          />
          <TextInput
            ref="input_2"
            style={styles.textInput}
            maxLength={1}
            value={this.state.secondChar}
            onChangeText={async value => {
              await this.setState({
                secondChar: value,
              });
              if (this.state.secondChar.length > 0) {
                this.refs.input_3.focus();
              }
            }}
          />
          <TextInput
            ref="input_3"
            style={styles.textInput}
            maxLength={1}
            value={this.state.thirdChar}
            onChangeText={async value => {
              await this.setState({
                thirdChar: value,
              });
              if (this.state.thirdChar.length != 0) {
                this.refs.input_4.focus();
              }
            }}
          />
          <TextInput
            ref="input_4"
            style={styles.textInput}
            maxLength={1}
            value={this.state.forthChar}
            onChangeText={value => {
              this.setState({
                forthChar: value,
              });
            }}
          />
        </View>
        <BottomButton onPress={this.joinHandler}>Join</BottomButton>
      </MainView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  text: {
    color: '#e2d7aa',
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
    width: wp('12%'),
    height: wp('12%'),
    fontSize: wp('6%'),
    marginHorizontal: wp('2.5%'),
    color: '#e2d7aa',
    textAlign: 'center',
  },
});

export default JoinGameScreen;
