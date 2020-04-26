import React, {Component} from 'react';
import {View, Text, Image, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import AsyncStorage from '@react-native-community/async-storage';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';

import BoardView from '../../components/UI/Game/BoardView';
import BottomButton from '../../components/UI/Game/BottomButton';
import QuestList from '../../components/Game/QuestsList';
import API from '../../utils/API';
import {updateGameState} from '../../store/actions/index';

class BoardScreen extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    console.log(this.props);
  }

  render() {
    return (
      <BoardView style={styles.container}>
        <QuestList
          style={styles.questsList}
          numberOfPlayers={this.props.numberOfPlayers}
        />
        <View style={styles.bottomContainer}>
          <BottomButton
            style={styles.bottomButton}
            onPress={this.kingCommandHandler}
            icon={require('../../assets/commander.png')}
          />
          <BottomButton
            style={styles.bottomButton}
            onPress={this.watchStateHandler}
            text="STATE"
          />
          <BottomButton
            style={styles.bottomButton}
            onPress={this.watchRoleHandler}
            icon={require('../../assets/role-data.png')}
          />
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
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: hp('3%'),
  },
});

const mapStateToProps = state => {
  return {
    commander: state.game.commander,
    questNumber: state.game.questNumber,
    players: state.game.players,
    numberOfPlayers: state.game.numberOfPlayers,
    role: state.game.roles,
    roleData: state.game.roleData,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    updateGameState: data => dispatch(updateGameState(data)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(BoardScreen);
