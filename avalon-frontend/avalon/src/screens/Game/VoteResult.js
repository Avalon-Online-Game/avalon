import React, {Component} from 'react';
import {
  Image,
  Text,
  FlatList,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {Navigation} from 'react-native-navigation';
import {connect} from 'react-redux';
import Modal from 'react-native-modal';

import DefaultButton from '../../components/UI/Game/DefultButton';
import avatars from '../../utils/avatars';
import DefaultColors from '../../components/UI/colors';

class VoteResultScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  dissmissHandler = () => {
    this.setState(
      {
        visible: false,
      },
      async () => {
        await Navigation.dismissModal(this.props.componentId);
      },
    );
  };

  voteImage = vote => {
    if (vote === 'approve') {
      return (
        <Image
          source={require('../../assets/popups/yes.png')}
          style={styles.voteImage}
        />
      );
    }
    return (
      <Image
        source={require('../../assets/popups/no.png')}
        style={styles.voteImage}
      />
    );
  };

  playerRenderItem = ({item}) => {
    const player = item[0];
    const vote = item[1];
    return (
      <TouchableWithoutFeedback style={styles.userButtonContainer}>
        <View style={styles.userButton}>
          <Image
            source={
              avatars.find(avatar => avatar.id === player.avatar.toString())
                .image
            }
            style={styles.userImage}
            resizeMode="contain"
          />
          <Text style={styles.userText}>{player.username}</Text>
          {this.voteImage(vote)}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  render() {
    return (
      <View>
        <Modal
          isVisible={this.state.visible}
          style={styles.overlay}
          backdropTransitionOutTiming={0}>
          <ImageBackground
            style={styles.background}
            source={require('../../assets/popups/modal-back.png')}
            resizeMode="contain">
            <FlatList
              style={styles.list}
              data={this.props.questPlayersVotes}
              renderItem={this.playerRenderItem}
              keyExtractor={(item, index) => String(index)}
              numColumns={2}
            />
            <DefaultButton style={styles.button} onPress={this.dissmissHandler}>
              Got it
            </DefaultButton>
          </ImageBackground>
        </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  background: {
    justifyContent: 'space-between',
    alignItems: 'center',
    width: wp('90%'),
    height: hp('70%'),
    backgroundColor: 'transparent',
  },
  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: hp('-4%'),
    width: wp('60%'),
  },
  list: {
    width: wp('60%'),
    height: hp('100%'),
  },
  userButton: {
    width: wp('20%'),
    marginTop: hp('1.5%'),
    marginHorizontal: wp('5%'),
    alignItems: 'center',
  },
  userImage: {
    width: wp('15%'),
    height: wp('15%'),
  },
  userText: {
    color: DefaultColors.light,
    fontSize: wp('4%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
  },
  voteImage: {
    width: wp('4.5%'),
    height: wp('4.5%'),
    marginTop: hp('0%'),
  },
});

const mapStateToProps = state => {
  return {
    // commander: state.game.commander,
    // questNumber: state.game.questNumber,
    players: state.game.players,
    // numberOfPlayers: state.game.numberOfPlayers,
    // role: state.game.role,
    // roleData: state.game.roleData,
    questPlayersVotes: state.game.questPlayersVotes,
  };
};

export default connect(mapStateToProps)(VoteResultScreen);
