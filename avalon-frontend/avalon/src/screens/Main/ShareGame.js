import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import MainView from '../../components/UI/Main/MainView';
import BottomButton from '../../components/UI/Main/BottomButton';

class ShareGameScreen extends Component {
  constructor(props) {
    super(props);
  }

  shareHandler = async () => {};

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.text}>Share game code</Text>
        <View style={styles.gameCodeContainer}>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(1)}</Text>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(2)}</Text>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(3)}</Text>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(4)}</Text>
        </View>
        <BottomButton onPress={this.shareHandler}>Next</BottomButton>
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
  gameCodeContainer: {
    flexDirection: 'row',
    marginBottom: hp('55%'),
  },
  gameCode: {
    backgroundColor: '#17242c',
    width: wp('12%'),
    height: wp('12%'),
    fontSize: wp('6%'),
    marginHorizontal: wp('2.5%'),
    color: '#e2d7aa',
    textAlign: 'center',
    textAlignVertical: 'center',
  },
});

export default ShareGameScreen;
