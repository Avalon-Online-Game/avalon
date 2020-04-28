import React, {Component} from 'react';
import {Text, StyleSheet} from 'react-native';
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';

import EntranceView from '../../components/UI/Entrance/EntranceView';
import DefaultButton from '../../components/UI/Entrance/DefaultButton';
import API from '../../utils/API';

class EntranceScreen extends Component {
  skipEntranceHandler = async () => {
    const user = JSON.parse(await AsyncStorage.getItem('user'));
    if (user !== null) {
      let headers = {
        'Content-Type': 'application/json',
        Authorization: `Token ${user.key}`,
      };
      API.get('users/rest-auth/user/', {
        headers: headers,
      })
        .then(async () => {
          const game = JSON.parse(await AsyncStorage.getItem('game'));
          if (game !== null) {
            headers = {
              'Content-Type': 'application/json',
              Authorization: `Token ${user.key}`,
            };
            API.get(`games/game/${game}/`, {
              headers: headers,
            })
              .then(async () => {
                const player = JSON.parse(await AsyncStorage.getItem('player'));
                if (player !== null) {
                  headers = {
                    'Content-Type': 'application/json',
                    Authorization: `Token ${user.key}`,
                  };
                  API.get(`players/player/${player}/`, {
                    headers: headers,
                  })
                    .then(async res => {
                      if (res.data.game.code === game) {
                        Navigation.setRoot({
                          root: {
                            stack: {
                              id: 'main',
                              children: [
                                {
                                  component: {
                                    name: 'avalon.LoadingScreen',
                                  },
                                },
                              ],
                            },
                          },
                        });
                      } else {
                        AsyncStorage.multiRemove(['game', 'player']);
                        Navigation.setRoot({
                          root: {
                            stack: {
                              id: 'main',
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
                      }
                    })
                    .catch(() => {
                      AsyncStorage.multiRemove(['game', 'player']);
                      Navigation.setRoot({
                        root: {
                          stack: {
                            id: 'main',
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
                    });
                } else {
                  AsyncStorage.multiRemove(['game', 'player']);
                  Navigation.setRoot({
                    root: {
                      stack: {
                        id: 'main',
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
                }
              })
              .catch(async () => {
                AsyncStorage.multiRemove(['game', 'player'], () => {
                  AsyncStorage.removeItem('game');
                });
                Navigation.setRoot({
                  root: {
                    stack: {
                      id: 'main',
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
              });
          } else {
            Navigation.setRoot({
              root: {
                stack: {
                  id: 'main',
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
          }
        })
        .catch(() => {
          AsyncStorage.removeItem('user');
          Navigation.setRoot({
            root: {
              component: {
                name: 'avalon.AuthScreen',
              },
            },
          });
        });
    } else {
      Navigation.setRoot({
        root: {
          component: {
            name: 'avalon.AuthScreen',
          },
        },
      });
    }
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
