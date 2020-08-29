import React, {Component} from 'react';
import {
  View,
  FlatList,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import quests from '../../utils/quests';
import {setGameQuests} from '../../store/actions/index';
import DefaultColors from '../UI/colors';

class QuestsList extends Component {
  constructor(props) {
    super(props);
    switch (this.props.numberOfPlayers) {
      case 5:
        this.props.setGameQuests(quests.quests5);
        break;
      case 6:
        this.props.setGameQuests(quests.quests6);
        break;
      case 7:
        this.props.setGameQuests(quests.quests7);
        break;
      case 8:
        this.props.setGameQuests(quests.quests8);
        break;
      case 9:
        this.props.setGameQuests(quests.quests9);
        break;
      case 10:
        this.props.setGameQuests(quests.quests10);
        break;
      default:
        break;
    }
  }

  // seeQuestHandler = quest => {};

  questRenderItem = ({item}) => {
    let detail;
    if (typeof item.detail !== undefined) {
      detail = <Text style={styles.questDetail}>{item.detail}</Text>;
    } else {
      detail = null;
    }
    let content;
    if (
      this.props.quests.filter(quest => quest.quest_number === item.id)
        .length !== 0
    ) {
      const questResult = this.props.quests.find(
        questItem => questItem.quest_number === item.id,
      ).result;
      const questResultBorder =
        questResult === 'success'
          ? require('../../assets/board/success-quest.png')
          : require('../../assets/board/fail-quest.png');
      content = (
        <View>
          {detail}
          <TouchableWithoutFeedback>
            <ImageBackground
              style={styles.questBackgroundBorder}
              source={questResultBorder}
              resizeMode="contain">
              <ImageBackground
                source={item.image}
                style={styles.questBackground}
                resizeMode="contain">
                <Text style={styles.questNumber}>{item.number}</Text>
              </ImageBackground>
            </ImageBackground>
          </TouchableWithoutFeedback>
        </View>
      );
    } else {
      content = (
        <View>
          {detail}
          <TouchableWithoutFeedback style={styles.questButton}>
            <View
              style={styles.questBackgroundBorder}
              source={require('../../assets/popups/player-back-border.png')}
              resizeMode="contain">
              <ImageBackground
                source={item.image}
                style={styles.questBackground}
                resizeMode="contain">
                <Text style={styles.questNumber}>{item.number}</Text>
              </ImageBackground>
            </View>
          </TouchableWithoutFeedback>
        </View>
      );
    }
    return content;
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={this.props.gameQuests}
          extraData={[this.props.gameQuests, this.props.numberOfPlayers]}
          renderItem={this.questRenderItem}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  listContent: {
    alignItems: 'center',
  },
  questBackgroundBorder: {
    width: hp('22%'),
    height: hp('22%'),
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: wp('0.5%'),
  },
  questBackground: {
    width: hp('20%'),
    height: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  questNumber: {
    color: DefaultColors.light,
    fontSize: wp('20%'),
    fontFamily: 'Dubai-Regular',
  },
  questDetail: {
    color: DefaultColors.light,
    fontSize: wp('4.5%'),
    height: hp('4%'),
    fontFamily: 'Dubai-Light',
    textAlign: 'center',
  },
  bottomActive: {
    opacity: 1,
  },
  bottomDeactive: {
    opacity: 0.5,
  },
});

const mapStateToProps = state => {
  return {
    numberOfPlayers: state.game.numberOfPlayers,
    currentQuestNumber: state.game.currentQuestNumber,
    quests: state.game.quests,
    failedVotings: state.game.failedVotings,
    gameQuests: state.game.gameQuests,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    setGameQuests: gameQuests => dispatch(setGameQuests(gameQuests)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(QuestsList);
