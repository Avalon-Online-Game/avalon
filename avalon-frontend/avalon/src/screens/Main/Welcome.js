import React, {Component} from 'react';
import {View, Image, Text, StyleSheet} from 'react-native';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import BottomButton from '../../components/UI/Main/BottomButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import AvatarsList from '../../components/Main/AvatarsList';
import API from '../../utils/API';
import {goMainMenu} from '../../utils/navigation';
import DefaultColors from '../../components/UI/colors';

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  nextHandler = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${user.key}`,
    };
    const data = {
      avatar: this.props.chosenAvatar.id,
    };
    API.patch('users/rest-auth/user/', data, {
      headers: headers,
    })
      .then(res => {
        AsyncStorage.mergeItem('user', JSON.stringify(res.data));
        goMainMenu();
      })
      .catch(err => {
        console.log(err.response.status);
      });
  };

  render() {
    return (
      <EntranceView>
        <View style={styles.content}>
          <View style={styles.contentInner}>
            <Image
              style={styles.tickImage}
              source={require('../../assets/main/welcome.png')}
            />
            <Text style={styles.avatarsListText}>Choose An Avatar</Text>
            <View style={styles.userContainer}>
              <Image
                style={styles.chosenAvatarImage}
                source={this.props.chosenAvatar.image}
                resizeMode="contain"
              />
              <Text style={styles.chosenAvatarText}>{this.props.username}</Text>
            </View>
            <AvatarsList style={styles.avatarsList} />
          </View>
          <BottomButton onPress={this.nextHandler}>Next</BottomButton>
        </View>
      </EntranceView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contentInner: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('10%'),
  },
  tickImage: {
    width: wp('30%'),
    height: wp('30%'),
  },
  avatarsListText: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: wp('6%'),
    color: DefaultColors.light,
    marginTop: hp('10%'),
  },
  userContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
  },
  chosenAvatarImage: {
    width: hp('12%'),
    height: hp('12%'),
  },
  chosenAvatarText: {
    fontFamily: 'JosefinSans-Light',
    fontSize: wp('5.5%'),
    color: DefaultColors.light,
  },
  avatarsList: {
    height: hp('12%'),
    marginTop: hp('2%'),
  },
});

const mapStateToProps = state => {
  return {
    chosenAvatar: state.user.chosenAvatar,
  };
};

export default connect(mapStateToProps)(WelcomeScreen);
