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
    this.setState({
      visible: false,
    });
    Navigation.dismissModal(this.props.componentId);
    this.props.confirmFunction();
  };

  dissmissHandler = () => {
    Navigation.dismissModal(this.props.componentId);
    this.setState({
      visible: false,
    });
  };

  render() {
    return (
      <View>
        <Modal
          isVisible={this.state.visible}
          style={styles.overlay}>
          <ImageBackground
            style={styles.background}
            source={require('../../assets/popups/popup-back.png')}
            resizeMode="contain">
            <Text style={styles.titleText}>{this.props.message}</Text>
            <View style={styles.buttonsContainer}>
              <DefaultButton
                buttonStyle={styles.button}
                backgroundStyle={styles.buttonBackground}
                textStyle={styles.buttonText}
                onPress={this.confirmHandler}>
                Yes
              </DefaultButton>
              <DefaultButton
                buttonStyle={styles.button}
                backgroundStyle={styles.buttonBackground}
                textStyle={styles.buttonText}
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
    width: wp('85%'),
    lineHeight: hp('5%'),
  },
  buttonsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  button: {
    marginTop: hp('5%'),
    marginHorizontal: wp('2%'),
  },
  buttonBackground: {
    width: wp('37%'),
  },
  buttonText: {},
});

export default ConfirmOverlay;
