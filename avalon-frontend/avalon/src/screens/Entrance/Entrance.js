import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import DefaultButton from '../../components/UI/Entrance/DefaultButton';
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

  skipEntranceHandler = () => {
    this.navigationFunction();
  };

  render() {
    return (
      <EntranceView>
        <Text style={styles.mainText}>AVALON</Text>
        <DefaultButton
          buttonStyle={styles.skipButton}
          onPress={this.skipEntranceHandler}>
          Skip
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
  mainText: {
    color: '#e4d7aa',
    fontFamily: 'JosefinSans-Bold',
    fontSize: 50,
    marginTop: '20%',
  },
  skipButton: {
    marginTop: '90%',
  },
});

export default EntranceScreen;
