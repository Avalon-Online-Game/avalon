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
import {updateGameState} from '../../store/actions/index';

class BoardScreen extends Component {
  constructor(props) {
    super(props);
  }

  kingCommandHandler = () => {};

  watchRoleHandler = () => {};

  render() {
    return (
      <BoardView style={styles.container}>
        <QuestList
          style={styles.questsList}
          numberOfPlayers={this.props.numberOfPlayers}
        />
        <BottomButton
          style={styles.kingCommandButton}
          onPress={this.kingCommandHandler}
          icon={require('../../assets/board/commander.png')}
        />
        <View style={styles.bottomContainer}>
          <BottomButton
            style={styles.watchRoleButton}
            onPress={this.watchRoleHandler}
            icon={require('../../assets/board/role-data.png')}
          />
          <View style={styles.roleButtonsContainer}>
            <View style={styles.king}>
              <Image
                resizeMode="contain"
                style={styles.roleButtonImage}
                source={require('../../assets/board/lady-of-the-lake.png')}
              />
            </View>
            <View style={styles.ladyOfTheLake}>
              <Image
                resizeMode="contain"
                style={styles.roleButtonImage}
                source={require('../../assets/board/lady-of-the-lake.png')}
              />
            </View>
          </View>
        </View>
      </BoardView>
    );
  }
}

const styles = StyleSheet.create({
  questsList: {
    height: hp('25%'),
    marginTop: hp('2%'),
  },
  bottomContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: wp('2%'),
  },
  kingCommandButton: {
    marginTop: hp('13%'),
    marginHorizontal: wp('2%'),
  },
  roleButtonsContainer: {
    flexDirection: 'row',
    marginBottom: hp('3%'),
  },
  roleButtonImage: {
    width: wp('18%'),
    height: wp('18%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ladyOfTheLake: {},
  king: {
    marginRight: wp('2%'),
  },
});

const mapStateToProps = state => {
  return {
    commander: state.game.commander,
    questNumber: state.game.questNumber,
    players: state.game.players,
    numberOfPlayers: state.game.numberOfPlayers,
    role: state.game.role,
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
