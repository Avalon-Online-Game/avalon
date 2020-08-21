import React, {Component} from 'react';
import {
  Image,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import {Overlay} from 'react-native-elements';

import DefaultButton from '../../components/UI/Game/DefultButton';
import avatars from '../../utils/avatars';
import {wsSend} from '../../store/actions/index';
import DefaultColors from '../../components/UI/colors';
import {showLongBottomToast} from '../../utils/toasts';

class PlayersScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
      chosenPlayers: [],
    };
    this.currentQuest = this.props.gameQuests.find(
      quest => quest.id === this.props.currentQuestNumber,
    );
  }

  dissmissHandler = () => {
    this.setState({
      visible: false,
    });
    Navigation.dismissModal(this.props.componentId);
  };

  onButtonHandler = () => {
    if (this.props.isPlayerCommander) {
      if (
        this.state.chosenPlayers.length !==
        parseInt(this.currentQuest.number, 10)
      ) {
        showLongBottomToast(`Choose exactly ${this.currentQuest.number} players`);
        return;
      }
      const msg = {
        msg_type: 'quest_choice',
        players: this.state.chosenPlayers,
      };
      this.props.wsSend(msg);
    }
    this.setState({
      visible: false,
    });
    Navigation.dismissModal(this.props.componentId);
  };

  clickOnPlayerHandler = player => {
    if (this.props.isPlayerCommander) {
      if (
        this.state.chosenPlayers.filter(item => item.token === player.token)
          .length !== 0
      ) {
        this.setState(prevState => {
          return {
            ...prevState,
            chosenPlayers: prevState.chosenPlayers.filter(
              item => item.token !== player.token,
            ),
          };
        });
      } else {
        this.setState(prevState => {
          return {
            ...prevState,
            chosenPlayers: prevState.chosenPlayers.concat(player),
          };
        });
      }
    }
  };

  playerRenderItem = ({item}) => {
    let content =
      this.state.chosenPlayers.filter(player => item.token === player.token)
        .length !== 0 && this.props.isPlayerCommander ? (
        // selected user views
        <ImageBackground
          style={styles.userBackgroundBorder}
          source={require('../../assets/popups/player-back-border.png')}
          resizeMode="contain">
          <ImageBackground
            source={require('../../assets/popups/player-back.png')}
            style={styles.userBackground}
            resizeMode="contain">
            <Image
              source={
                avatars.find(avatar => avatar.id === item.avatar.toString())
                  .image
              }
              style={styles.userImage}
              resizeMode="contain"
            />
            <Text style={styles.userText}>{item.username}</Text>
          </ImageBackground>
        </ImageBackground>
      ) : (
        // unselected user views
        <View
          style={[
            styles.userBackgroundBorder,
            this.state.chosenPlayers.length ===
            parseInt(this.currentQuest.number, 10)
              ? styles.buttonDeactivate
              : undefined,
          ]}>
          <ImageBackground
            source={require('../../assets/popups/player-back.png')}
            style={styles.userBackground}
            resizeMode="contain">
            <Image
              source={
                avatars.find(avatar => avatar.id === item.avatar.toString())
                  .image
              }
              style={styles.userImage}
              resizeMode="contain"
            />
            <Text style={styles.userText} numberOfLines={1}>
              {item.username}
            </Text>
          </ImageBackground>
        </View>
      );
    return (
      <TouchableOpacity
        style={styles.userButtonContainer}
        onPressIn={() => this.clickOnPlayerHandler(item)}
        disabled={
          this.state.chosenPlayers.filter(player => item.token === player.token)
            .length === 0 &&
          this.state.chosenPlayers.length ===
            parseInt(this.currentQuest.number, 10)
            ? true
            : false
        }>
        {content}
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <Overlay
          backdropStyle={styles.backdrop}
          onBackdropPress={this.dissmissHandler}
          isVisible={this.state.visible}
          overlayStyle={styles.overlayStyle}>
          <View>
            <ImageBackground
              style={styles.background}
              source={require('../../assets/popups/modal-back.png')}
              resizeMode="contain">
              <FlatList
                style={styles.list}
                data={this.props.players}
                extraData={this.state.chosenPlayers}
                renderItem={this.playerRenderItem}
                keyExtractor={item => item.token}
                numColumns={2}
              />
              <DefaultButton
                style={styles.button}
                onPress={this.onButtonHandler}>
                {this.props.buttonText}
              </DefaultButton>
            </ImageBackground>
          </View>
        </Overlay>
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
  overlayStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  background: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('95%'),
    height: hp('90%'),
    backgroundColor: 'transparent',
  },
  list: {
    marginTop: hp('7%'),
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('2.7%'),
    width: wp('60%'),
    borderColor: DefaultColors.light,
  },
  buttonDeactivate: {
    opacity: 0.5,
  },
  userButtonContainer: {},
  userButton: {
    width: wp('20%'),
    marginHorizontal: wp('5%'),
    alignItems: 'center',
  },
  userBackgroundBorder: {
    width: wp('27%'),
    height: wp('27%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: hp('1.5%'),
    marginHorizontal: wp('5%'),
  },
  userBackground: {
    width: wp('26%'),
    height: wp('26%'),
    justifyContent: 'center',
    alignItems: 'center',
  },
  userImage: {
    width: wp('18%'),
    height: wp('18%'),
  },
  userText: {
    color: DefaultColors.light,
    fontSize: wp('4%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Light',
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
    gameQuests: state.game.gameQuests,
    currentQuestNumber: state.game.currentQuestNumber,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    wsSend: msg => dispatch(wsSend(msg)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(PlayersScreen);
