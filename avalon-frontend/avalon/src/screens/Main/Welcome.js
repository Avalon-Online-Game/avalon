import React, {Component} from 'react';
import {Image, Text, StyleSheet} from 'react-native';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import AvatarsList from '../../components/Main/AvatarsList';
import {goMainMenu} from '../../utils/navigation';

class WelcomeScreen extends Component {
  tutorialHandler = () => {};

  skipHandler = () => {
    goMainMenu();
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
        <Text style={styles.avatarsListText}>
          Choose an avatar for yourself
        </Text>
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
          Skip>
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
    marginTop: hp('40%'),
  },
  skipButton: {
    marginTop: hp('5%'),
  },
  skipButtonText: {
    color: '#e2d7aa',
    fontSize: wp('8%'),
    fontFamily: 'JosefinSans-Light',
    opacity: 0.5,
  },
});

const mapStateToProps = state => {
  return {
    chosenAvatar: state.user.chosenAvatar,
  };
};

export default connect(mapStateToProps)(WelcomeScreen);
