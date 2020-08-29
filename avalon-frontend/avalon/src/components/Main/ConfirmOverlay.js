import React, {Component} from 'react';
import {Text, ImageBackground, StyleSheet, View} from 'react-native';
import Modal from 'react-native-modal';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';

import DefaultButton from '../UI/Main/DefaultButton';
import DefaultColors from '../UI/colors';

class ConfirmOverlay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  confirmHandler = () => {
    this.setState(
      {
        visible: false,
      },
      async () => {
        await this.props.confirmFunction();
      },
    );
  };

  dissmissHandler = () => {
    this.setState(
      {
        visible: false,
      },
      async () => {
        await Navigation.dismissModal(this.props.componentId);
      },
    );
  };

  render() {
    return (
      <View>
        <Modal
          isVisible={this.state.visible}
          style={styles.overlay}
          backdropTransitionOutTiming={0}>
          <ImageBackground
            style={styles.background}
            source={require('../../assets/popups/popup-back.png')}
            resizeMode="contain">
            <Text style={styles.titleText}>{this.props.message}</Text>
            <View style={styles.buttonsContainer}>
              <DefaultButton
                buttonStyle={styles.button}
                backgroundStyle={styles.buttonBackground}
                onPress={this.confirmHandler}>
                Yes
              </DefaultButton>
              <DefaultButton
                buttonStyle={styles.button}
                backgroundStyle={styles.buttonBackground}
                onPress={this.dissmissHandler}>
                No
              </DefaultButton>
            </View>
          </ImageBackground>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('40%'),
  },
  titleText: {
    color: DefaultColors.light,
    fontSize: wp('7%'),
    textAlign: 'center',
    fontFamily: 'JosefinSans-Regular',
    width: wp('70%'),
    lineHeight: hp('5.5%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: hp('5%'),
    marginHorizontal: wp('3%'),
    width: wp('35%'),
    height: hp('5%'),
  },
  buttonBackground: {
    width: '100%',
    height: '100%',
  },
});

export default ConfirmOverlay;
