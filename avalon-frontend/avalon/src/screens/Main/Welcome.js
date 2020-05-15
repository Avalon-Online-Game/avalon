import React, {Component} from 'react';
import {Image, Text, StyleSheet} from 'react-native';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';

import AvatarsList from '../../components/Main/AvatarsList';
import API from '../../utils/API';
import {goMainMenu} from '../../utils/navigation';

class WelcomeScreen extends Component {
  constructor(props) {
    super(props);
  }

  tutorialHandler = () => {};

  skipHandler = async () => {
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
        AsyncStorage.setItem('user', JSON.stringify(res.data));
        goMainMenu();
      })
      .catch(err => {
        console.log(err.response.status);
      });
  };

  render() {
    return (
      <EntranceView>
        <Image
          style={styles.tickImage}
          source={require('../../assets/main/welcome.png')}
        />
        <Image
          style={styles.chosenAvatarImage}
          source={this.props.chosenAvatar.image}
          resizeMode="contain"
        />
        <Text style={styles.avatarsListText}>Choose an avatar</Text>
        <AvatarsList style={styles.avatarsList} />
        <DefaultButton
          buttonStyle={styles.tutorialButton}
          onPress={this.tutorialHandler}>
          Tutorial
        </DefaultButton>
        <DefaultButton
          buttonStyle={styles.skipButton}
          transparentButton={true}
          textStyle={styles.skipButtonText}
          onPress={this.skipHandler}>
          Next>
        </DefaultButton>
      </EntranceView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
  },
  tickImage: {
    marginTop: hp('10%'),
    width: wp('30%'),
    height: wp('30%'),
  },
  tutorialButton: {
    marginTop: hp('10%'),
  },
  skipButton: {
    marginTop: hp('3%'),
  },
  skipButtonText: {
    color: '#e2d7aa',
    fontSize: wp('8%'),
    fontFamily: 'JosefinSans-Light',
    opacity: 0.5,
  },
  chosenAvatarImage: {
    width: hp('12%'),
    height: hp('12%'),
    marginTop: hp('5%'),
  },
  avatarsListText: {
    fontFamily: 'JosefinSans-Regular',
    fontSize: wp('5%'),
    color: '#e2d7aa',
    marginTop: wp('3%'),
  },
  avatarsList: {
    height: hp('12%'),
    marginTop: hp('2%'),
    // backgroundColor: 'red',
  },
});

const mapStateToProps = state => {
  return {
    chosenAvatar: state.user.chosenAvatar,
  };
};

export default connect(mapStateToProps)(WelcomeScreen);
