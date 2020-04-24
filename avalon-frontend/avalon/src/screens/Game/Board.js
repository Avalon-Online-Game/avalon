import React, {Component} from 'react';
import {View, Text, TouchableHighlight, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import BoardView from '../../components/UI/Game/BoardView';
import DefaultButton from '../../components/UI/Game/BottomButton';
import QuestList from '../../components/Game/QuestsList';
import API from '../../utils/API';
import consumer from '../../utils/ws';

class BoardScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      commander: '',
      questNumber: '',
      players: [],
      role: '',
      roleData: [],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem('player').then(token => {
      // eslint-disable-next-line no-undef
      const ws = new WebSocket(
        `ws://127.0.0.1:8000/ws/game/?token=${JSON.parse(token)}`,
      );
      ws.onopen = () => {
        console.log('ws opened!');
      };
      ws.onmessage = this.wsReceiveState;
    });
  }

  wsReceiveState = event => {
    let data = JSON.parse(event.data);
    this.setState({
      players: data.game_state.players,
      commander: data.game_state.commander,
      // questNumber: event.data.gameState.players,
      role: data.player_state.role,
      roleData: data.player_state.role_data,
    });
  };

  render() {
    return (
      <BoardView style={styles.container}>
        <QuestList
          style={styles.questsList}
          numberOfPlayers={this.state.players.length}
        />
        <View style={styles.bottomContainer}>
          <DefaultButton
            style={styles.bottomButton}
            onPress={this.kingCommandHandler}>
            king
          </DefaultButton>
          <DefaultButton
            style={styles.bottomButton}
            onPress={this.watchStateHandler}>
            state
          </DefaultButton>
          <DefaultButton
            style={styles.bottomButton}
            onPress={this.watchRoleHandler}>
            role
          </DefaultButton>
        </View>
      </BoardView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'space-between',
  },
  questsList: {
    height: hp('30%'),
    backgroundColor: 'white',
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

// const mapStateToProps = state => {
//   return {
//     numberOfPlayers: state.roles.numberOfPlayers,
//   };
// };

// export default connect(mapStateToProps)(BoardScreen);
export default BoardScreen;
