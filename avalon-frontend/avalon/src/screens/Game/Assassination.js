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

import avatars from '../../utils/avatars';
import DefaultColors from '../../components/UI/colors';

class AssassinationScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: true,
    };
  }

  clickOnPlayerHandler = player => {
    Navigation.showModal({
      component: {
        id: 'assassinationConfirmationScreen',
        name: 'avalon.AssassinationConfirmationScreen',
        options: {
          modalTransitionStyle: 'crossDissolve',
          modalPresentationStyle: 'overCurrentContext',
        },
        passProps: {
          player: player,
        },
      },
    });
  };

  playerRenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.userButtonContainer}
        onPressIn={() => this.clickOnPlayerHandler(item)}>
        <View style={styles.userContainer}>
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
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View>
        <Overlay
          backdropStyle={styles.backdrop}
          // onBackdropPress={this.dissmissHandler}
          isVisible={this.state.visible}
          overlayStyle={styles.overlayStyle}>
          <ImageBackground
            style={styles.background}
            source={require('../../assets/popups/modal-back.png')}
            resizeMode="contain">
            <Text style={styles.mainText}>
              Choose one of the players to assassinate
            </Text>
            <FlatList
              style={styles.list}
              data={this.props.assassinationChoices}
              extraData={this.state.chosenPlayer}
              renderItem={this.playerRenderItem}
              keyExtractor={item => item.token}
              numColumns={2}
            />
          </ImageBackground>
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
  mainText: {
    color: DefaultColors.light,
    fontSize: wp('6%'),
    textAlign: 'center',
    textAlignVertical: 'center',
    fontFamily: 'JosefinSans-Medium',
    marginTop: hp('15%'),
    // backgroundColor: 'red',
  },
  list: {
    marginTop: hp('5%'),
  },
  userButtonContainer: {},
  userButton: {
    width: wp('20%'),
    marginHorizontal: wp('5%'),
    alignItems: 'center',
  },
  userContainer: {
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
    assassinationChoices: state.game.assassinationChoices,
  };
};

export default connect(mapStateToProps)(AssassinationScreen);
