import React, {Component} from 'react';
import {Text, Image, StyleSheet, View} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import API from '../../utils/API';
import {goAuth, goLoading, goMainMenu} from '../../utils/navigation';

class EntranceScreen extends Component {
  constructor(props) {
    super(props);
    this.navigationFunction = undefined;
  }

  async componentDidMount() {
    this.user = JSON.parse(await AsyncStorage.getItem('user'));
    this.game = JSON.parse(await AsyncStorage.getItem('game'));
    this.player = JSON.parse(await AsyncStorage.getItem('player'));
    if (await this.isUserValid()) {
      if (await this.isGameValid()) {
        await this.isPlayerValid();
      }
    }
    await new Promise(resolve => setTimeout(resolve, 4000));
    this.navigationFunction();
  }

  isUserValid = async () => {
    if (this.user !== undefined && this.user != null) {
      const headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${this.user.key}`,
      };
      try {
        await API.get('users/rest-auth/user/', {
          headers: headers,
        });
        this.navigationFunction = goMainMenu;
        return true;
      } catch (error) {
        AsyncStorage.removeItem('user');
        this.navigationFunction = goAuth;
        return false;
      }
    } else {
      this.navigationFunction = goAuth;
      return false;
    }
  };

  isGameValid = async () => {
    if (this.game !== undefined && this.game != null) {
      const headers = {
        Authorization: `Token ${this.user.key}`,
        'Content-Type': 'application/json',
      };
      try {
        await API.get(`games/game/${this.game}/`, {
          headers: headers,
        });
        return true;
      } catch (error) {
        AsyncStorage.multiRemove(['game', 'player'], () => {
          AsyncStorage.removeItem('game');
        });
        this.navigationFunction = goMainMenu;
        return false;
      }
    } else {
      this.navigationFunction = goMainMenu;
      return false;
    }
  };

  isPlayerValid = async () => {
    if (this.player !== undefined && this.player != null) {
      const headers = {
        Authorization: `Token ${this.user.key}`,
        'Content-Type': 'application/json',
      };

      try {
        const response = await API.get(`players/player/${this.player}/`, {
          headers: headers,
        });
        if (response.data.game.code === this.game) {
          this.navigationFunction = goLoading;
          return true;
        } else {
          AsyncStorage.multiRemove(['game', 'player']);
          this.navigationFunction = goMainMenu;
          return false;
        }
      } catch (error) {
        AsyncStorage.multiRemove(['game', 'player']);
        this.navigationFunction = goMainMenu;
        return false;
      }
    } else {
      AsyncStorage.multiRemove(['game', 'player']);
      this.navigationFunction = goMainMenu;
      return false;
    }
  };

  render() {
    return (
      <EntranceView>
        <View style={styles.content}>
          <Image
            style={styles.crownImage}
            source={require('../../assets/main/crown.png')}
            resizeMode="contain"
          />
          <Text style={styles.mainText}>AVALON</Text>
          <Image
            style={styles.castleImage}
            source={require('../../assets/main/castle.png')}
            resizeMode="contain"
          />
        </View>
      </EntranceView>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    alignItems: 'center',
  },
  crownImage: {
    width: wp('15%'),
    height: hp('8%'),
    marginTop: hp('15%'),
    alignSelf: 'flex-end',
    transform: [
      {
        rotate: '15deg',
      },
    ],
    marginBottom: hp('-2%'),
    marginRight: wp('-3%'),
  },
  mainText: {
    color: '#e4d7aa',
    fontFamily: 'JosefinSans-Bold',
    fontSize: wp('17%'),
  },
  castleImage: {
    width: wp('70%'),
    height: hp('40%'),
    marginTop: hp('10%'),
  },
  skipButton: {
    marginTop: hp('10%'),
  },
});

export default EntranceScreen;
