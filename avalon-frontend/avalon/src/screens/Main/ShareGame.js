import React, {Component} from 'react';
import {
  View,
  Text,
  StyleSheet,
  BackHandler,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Share from 'react-native-share';
import Icon from 'react-native-vector-icons/MaterialIcons';

import MainView from '../../components/UI/Main/MainView';
import BottomButton from '../../components/UI/Main/BottomButton';
import {goLoading} from './navigation';
import DefaultColors from '../../components/UI/colors';

class ShareGameScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    BackHandler.addEventListener('hardwareBackPress', this.onBackPress);
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.onBackPress);
  }

  onBackPress = () => {
    return true;
  };

  shareHandler = () => {
    const options = {
      title: 'Share your code with others',
      subject: 'Join me on Avalon!',
      message: `Avalon! Game Code: ${this.props.gameCode}`,
    };
    Share.open(options)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        err && console.log(err);
      });
  };

  nextHandler = () => {
    goLoading();
  };

  render() {
    return (
      <MainView style={styles.container}>
        <Text style={styles.text}>Game Code</Text>
        <View style={styles.gameCodeContainer}>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(0)}</Text>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(1)}</Text>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(2)}</Text>
          <Text style={styles.gameCode}>{this.props.gameCode.charAt(3)}</Text>
        </View>
        <TouchableWithoutFeedback onPress={this.shareHandler}>
          <Icon name="share" style={styles.shareIcon} size={wp('10%')} />
        </TouchableWithoutFeedback>
        <Text style={styles.shareText}>Share your code</Text>
        <BottomButton onPress={this.nextHandler}>Next</BottomButton>
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
    fontSize: wp('8%'),
    marginTop: hp('10%'),
    fontFamily: 'JosefinSans-Medium',
  },
  gameCodeContainer: {
    flexDirection: 'row',
    marginTop: hp('-18%'),
  },
  gameCode: {
    backgroundColor: '#17242c',
    width: wp('12%'),
    height: wp('12%'),
    fontSize: wp('6%'),
    marginHorizontal: wp('2.5%'),
    color: DefaultColors.light,
    textAlign: 'center',
    textAlignVertical: 'center',
  },
  shareIcon: {
    color: DefaultColors.light,
  },
  shareText: {
    marginTop: hp('-20%'),
    color: DefaultColors.light,
    fontSize: wp('6%'),
    fontFamily: 'JosefinSans-Medium',
  },
});

export default ShareGameScreen;
