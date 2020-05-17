import React, {Component} from 'react';
import {Text, ImageBackground, StyleSheet, View} from 'react-native';
import {Overlay} from 'react-native-elements';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import DefaultButton from '../UI/Main/DefaultButton';
import {goAuth} from '../../utils/navigation';

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
    this.setState({
      visible: false,
    });
    Navigation.dismissModal(this.props.componentId);
  };

  render() {
    return (
      <Overlay
        backdropStyle={styles.backdrop}
        onBackdropPress={this.dissmissHandler}
        isVisible={this.state.visible}
        overlayStyle={styles.overlayStyle}>
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
      </Overlay>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000A0',
  },
  overlayStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('40%'),
    backgroundColor: 'transparent',
  },
  titleText: {
    color: '#e2d7aa',
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
