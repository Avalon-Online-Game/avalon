import React, {Component} from 'react';
import {
  Image,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import API from '../../utils/API';
import avatars from '../../utils/avatars';
import roles from '../../utils/roles';
import DefaultColors from '../../components/UI/colors';

class EndScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      chosenPlayers: [],
    };
    this.imageBackground =
      this.props.winner === 'good'
        ? require('../../assets/popups/good-end.png')
        : require('../../assets/popups/evil-end.png');
    this.mainText = this.props.winner === 'good' ? 'Goods Won!' : 'Evils Won!';
  }

  dissmissHandler = async () => {
    const userToken = JSON.parse(await AsyncStorage.getItem('user')).key;
    const gameCode = JSON.parse(await AsyncStorage.getItem('game'));
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Token ${userToken}`,
    };
    API.delete(`games/game/${gameCode}`, {
      headers: headers,
    });
    this.setState({
      visible: false,
    });
    Navigation.dismissModal(this.props.componentId);
    Navigation.setStackRoot('mainStack', {
      component: {
        id: 'mainMenuScreen',
        name: 'avalon.MainMenuScreen',
      },
    });
  };

  playerRenderItem = ({item}) => {
    const player = item[0];
    const playerRole = item[1];
    return (
      <View style={styles.playerContainer}>
        <Image
          source={roles.find(role => role.id === playerRole).image}
          style={styles.roleImage}
          resizeMode="contain"
        />
        <View style={styles.userContainer}>
          <Image
            style={styles.userImage}
            source={
              avatars.find(avatar => avatar.id === player.avatar.toString())
                .image
            }
            resizeMode="contain"
          />
          <Text style={styles.userText}>{player.username}</Text>
        </View>
      </View>
    );
  };

  render() {
    return (
      <View>
        <Modal
          onBackdropPress={this.dissmissHandler}
          onBackButtonPress={this.dissmissHandler}
          isVisible={this.state.visible}
          style={styles.overlay}>
          <ImageBackground
            style={styles.background}
            source={this.imageBackground}
            resizeMode="contain">
            <FlatList
              style={styles.list}
              contentContainerStyle={styles.listContent}
              data={this.props.playersRoles}
              extraData={this.props.playersRoles}
              renderItem={this.playerRenderItem}
              keyExtractor={item => item[0].token}
              numColumns={2}
            />
            <Text style={styles.mainText}>{this.mainText}</Text>
          </ImageBackground>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000D0',
  },
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  background: {
    justifyContent: 'center',
    alignItems: 'center',
    width: wp('100%'),
    height: hp('100%'),
    backgroundColor: 'transparent',
  },
  list: {
    marginTop: hp('7%'),
    marginBottom: hp('9%'),
  },
  listContent: {
    alignItems: 'center',
  },
  playerContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('2%'),
    marginHorizontal: wp('5%'),
  },
  roleImage: {
    width: wp('23%'),
    height: wp('23%'),
  },
  userContainer: {
    flexDirection: 'row',
  },
  userImage: {
    width: wp('7%'),
    height: wp('7%'),
    marginHorizontal: wp('1%'),
  },
  userText: {
    color: DefaultColors.light,
    fontSize: wp('5%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginHorizontal: wp('2%'),
  },
  mainText: {
    color: DefaultColors.light,
    fontSize: wp('7.5%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginBottom: hp('7.5%'),
  },
});

const mapStateToProps = state => {
  return {
    currentQuestNumber: state.game.currentQuestNumber,
    winner: state.game.winner,
    assassinatedPlayer: state.game.assassinatedPlayer,
    playersRoles: state.game.playersRoles,
  };
};

export default connect(mapStateToProps)(EndScreen);
