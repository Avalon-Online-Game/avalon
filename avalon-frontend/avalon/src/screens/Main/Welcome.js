import React, {Component} from 'react';
import {Image, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import DefaultButton from '../../components/UI/Main/DefaultButton';
import {
  heightPercentageToDP as hp,
  widthPercentageToDP as wp,
} from 'react-native-responsive-screen';

class WelcomeScreen extends Component {
  tutorialHandler = () => {};

  skipHandler = () => {
    Navigation.setRoot({
      root: {
        stack: {
          children: [
            {
              component: {
                name: 'avalon.MainMenuScreen',
              },
            },
          ],
        },
      },
    });
  };

  render() {
    return (
      <EntranceView>
        <Image
          style={styles.tickImage}
          source={require('../../assets/welcome.png')}
        />
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
  skipButtonText: {
    color: '#e2d7aa',
    fontSize: wp('8%'),
    fontFamily: 'JosefinSans-Light',
    opacity: 0.5,
  },
});

export default WelcomeScreen;
