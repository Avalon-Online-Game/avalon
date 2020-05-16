import React, {Component} from 'react';
import {View, Text, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import DefaultButton from '../../components/UI/Entrance/DefaultButton';
import TabButton from '../../components/UI/Entrance/TabButton';
import DefaultInput from '../../components/UI/Entrance/DefaultInput';
import API from '../../utils/API';
import {goWelcome} from '../../utils/navigation';

class AuthScreen extends Component {
  constructor() {
    super();
    this.state = {
      page: 'login',
      loginOpacity: 1,
      signupOpacity: 0.5,
      signupUsername: '',
      loginPassword: '',
      signupPassword: '',
      signupEmail: '',
      loginUsername: '',
      signupEmailError: '',
      signupUsernameError: '',
      signupPasswordError: '',
      loginError: '',
    };
  }

  startMainScreen = () => {
    goWelcome();
  };

  signupHandler = () => {
    if (this.state.signupEmailError.length > 0) {
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      username: this.state.signupUsername,
      email: this.state.signupEmail,
      password: this.state.signupPassword,
    };
    API.post('users/rest-auth/registration/', data, {
      headers: headers,
    })
      .then(async res => {
        await AsyncStorage.setItem('user', JSON.stringify(res.data));
        this.startMainScreen();
      })
      .catch(err => {
        if (err.response.data.email) {
          this.setState({
            signupEmailError: 'Email address has already been registered',
          });
        }
        if (err.response.data.username) {
          this.setState({
            signupUsernameError: 'Username is taken by another user',
          });
        }
        if (err.response.data.password) {
          this.setState({
            signupPasswordError: err.response.data.password,
          });
        }
      });
  };

  loginHandler = () => {
    if (this.state.loginError.length > 0) {
      return;
    }
    const headers = {
      'Content-Type': 'application/json',
    };
    const data = {
      username: this.state.loginUsername,
      password: this.state.loginPassword,
    };
    API.post('users/rest-auth/login/', data, {
      headers: headers,
    })
      .then(res => {
        AsyncStorage.setItem('user', JSON.stringify(res.data));
        this.startMainScreen();
      })
      .catch(err => {
        if (err.response.data.non_field_errors) {
          this.setState({
            loginError: 'Username or password is incorrect',
          });
        }
      });
  };

  googleLoginHandler = () => {};

  forgotPasswordHandler = () => {};

  onLoginUsernameChange = value => {
    this.setState({
      loginUsername: value,
      loginError: '',
    });
  };

  onLoginPasswordChange = value => {
    this.setState({
      loginPassword: value,
      loginError: '',
    });
  };

  onSignupUsernameChange = value => {
    this.setState({
      signupUsername: value,
      signupUsernameError: '',
    });
  };

  onSignupEmailChange = value => {
    this.setState({
      signupEmail: value,
      signupEmailError: '',
    });
  };

  signupEmailEndEditHandler = value => {
    const regex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (regex.test(value) === false) {
      this.setState({
        signupEmailError: 'Enter a valid Email address',
      });
    }
  };

  onSignupPasswordChange = value => {
    this.setState({
      signupPassword: value,
      signupPasswordError: '',
    });
  };

  switchLogin = () => {
    this.setState({
      page: 'login',
      loginOpacity: 1,
      signupOpacity: 0.5,
    });
  };

  switchSignup = () => {
    this.setState({
      page: 'signup',
      loginOpacity: 0.5,
      signupOpacity: 1,
    });
  };

  render() {
    let content;
    if (this.state.page === 'login') {
      content = (
        <View style={styles.inner}>
          <DefaultInput
            onChangeText={this.onLoginUsernameChange}
            value={this.state.loginUsername}
            placeholder="Username or Email Address"
            style={
              this.state.loginError.length > 0 ? styles.errorInput : undefined
            }
          />
          <DefaultInput
            onChangeText={this.onLoginPasswordChange}
            value={this.state.loginPassword}
            secureTextEntry={true}
            placeholder="Password"
            style={[
              {marginTop: hp('3%')},
              this.state.loginError.length > 0 ? styles.errorInput : undefined,
            ]}
          />
          <Text style={styles.errorText}>{this.state.loginError}</Text>
          <DefaultButton onPress={this.loginHandler}>Login</DefaultButton>
          <DefaultButton
            onPress={this.googleLoginHandler}
            buttonStyle={styles.googleButton}
            textStyle={styles.googleButtonText}
            Icon={
              <Icon
                style={styles.googleIcon}
                name="google"
                size={20}
                color="#e2d7aa"
              />
            }>
            Login With Google
          </DefaultButton>
          <DefaultButton
            onPress={this.forgotPasswordHandler}
            buttonStyle={styles.forgotPasswordButton}
            textStyle={styles.forgotPasswordText}>
            Forgot Password?
          </DefaultButton>
        </View>
      );
    } else if (this.state.page === 'signup') {
      content = (
        <View style={styles.inner}>
          <DefaultInput
            value={this.state.signupUsername}
            onChangeText={this.onSignupUsernameChange}
            placeholder="Username"
            style={
              this.state.signupUsernameError.length > 0
                ? styles.errorInput
                : undefined
            }
          />
          <Text style={styles.errorText}>{this.state.signupUsernameError}</Text>
          <DefaultInput
            value={this.state.signupEmail}
            onChangeText={this.onSignupEmailChange}
            onEndEditing={this.signupEmailEndEditHandler}
            placeholder="Email Address"
            style={
              this.state.signupEmailError.length > 0
                ? styles.errorInput
                : undefined
            }
          />
          <Text style={styles.errorText}>{this.state.signupEmailError}</Text>
          <DefaultInput
            value={this.state.signupPassword}
            onChangeText={this.onSignupPasswordChange}
            secureTextEntry={true}
            placeholder="Password"
            style={
              this.state.signupPasswordError.length > 0
                ? styles.errorInput
                : undefined
            }
          />
          <Text style={styles.errorText}>{this.state.signupPasswordError}</Text>
          <DefaultButton onPress={this.signupHandler}>Sign up</DefaultButton>
        </View>
      );
    }

    return (
      <EntranceView>
        <View style={styles.container}>
          <View style={styles.tabButtons}>
            <TabButton
              title="Login"
              onPress={this.switchLogin}
              textStyle={{opacity: this.state.loginOpacity}}>
              Login
            </TabButton>
            <TabButton
              title="Signup"
              onPress={this.switchSignup}
              textStyle={{opacity: this.state.signupOpacity}}>
              Sign up
            </TabButton>
          </View>
          {content}
        </View>
      </EntranceView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: hp('2%'),
  },
  inner: {
    // alignItems: 'center',
    width: '100%',
    marginTop: hp('5%'),
  },
  errorInput: {
    borderColor: '#743834',
    borderWidth: 3,
  },
  errorText: {
    width: wp('80%'),
    alignItems: 'center',
    backgroundColor: 'transparent',
    color: '#743834',
    fontFamily: 'JosefinSans-Medium',
    fontSize: wp('4%'),
  },
  tabButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: wp('90%'),
  },
  googleIcon: {
    width: wp('10%'),
  },
  googleButton: {
    flexDirection: 'row',
    backgroundColor: '#17242c',
  },
  googleButtonText: {
    color: '#e2d7aa',
    fontFamily: 'JosefinSans-Medium',
    opacity: 0.5,
    textAlign: 'center',
    paddingRight: wp('5%'),
  },
  forgotPasswordButton: {
    backgroundColor: 'transparent',
    marginTop: hp('1.5%'),
  },
  forgotPasswordText: {
    color: '#e2d7aa',
    fontFamily: 'JosefinSans-Light',
    opacity: 0.5,
  },
});

export default AuthScreen;
