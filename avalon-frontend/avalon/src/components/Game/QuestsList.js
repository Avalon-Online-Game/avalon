import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';
import {chooseRole} from '../../store/actions/index';

const extractKey = ({id}) => id;

class QuestsList extends Component {
  constructor(props) {
    super(props);
    switch (this.props.numberOfPlayers) {
      case 5:
        this.data = this.quests5;
        return;
      case 6:
        this.data = this.quests6;
        return;
      case 7:
        this.data = this.quests7;
        return;
      case 8:
        this.data = this.quests8;
        return;
      case 9:
        this.data = this.quests9;
        return;
      case 10:
        this.data = this.quests10;
        return;
      default:
        return;
    }
  }

  quests5 = [
    {id: 1, number: 2},
    {id: 2, number: 3},
    {id: 3, number: 2},
    {id: 4, number: 3},
    {id: 5, number: 3},
  ];

  quests6 = [
    {id: 1, number: 2},
    {id: 2, number: 3},
    {id: 3, number: 4},
    {id: 4, number: 3},
    {id: 5, number: 4},
  ];

  quests7 = [
    {id: 1, number: 2},
    {id: 2, number: 3},
    {id: 3, number: 3},
    {id: 4, number: 4, detail: 'Two fails required'},
    {id: 5, number: 4},
  ];

  quests8 = [
    {id: 1, number: 3},
    {id: 2, number: 4},
    {id: 3, number: 4},
    {id: 4, number: 5, detail: 'Two fails required'},
    {id: 5, number: 5},
  ];

  quests9 = [
    {id: 1, number: 3},
    {id: 2, number: 4},
    {id: 3, number: 4},
    {id: 4, number: 5, detail: 'Two fails required'},
    {id: 5, number: 5},
  ];

  quests10 = [
    {id: 1, number: 3},
    {id: 2, number: 4},
    {id: 3, number: 4},
    {id: 4, number: 5, detail: 'Two fails required'},
    {id: 5, number: 5},
  ];

  seeQuestHandler = quest => {};

  questRenderItem = ({item}) => {
    let detail;
    if (typeof item.detail !== undefined) {
      detail = <Text>{item.detail}</Text>;
    } else {
      detail = undefined;
    }
    return (
      <View style={styles.questButtonContainer}>
        {detail}
        <TouchableOpacity
          style={styles.questButton}
          onPressIn={() => this.seeQuestHandler(item)}>
          <ImageBackground
            source={require('../../assets/quest.png')}
            style={styles.questBackground}
            resizeMode="contain">
            <Text style={styles.questNumber}>{item.number}</Text>
          </ImageBackground>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={this.data}
          extraData={this.data}
          renderItem={this.questRenderItem}
          keyExtractor={extractKey}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {
    backgroundColor: 'transparent',
  },
  listContent: {
    alignItems: 'center',
  },
  questButton: {
    marginHorizontal: wp('2%'),
  },
  questBackground: {
    width: wp('45%'),
    height: wp('45%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  questNumber: {
    color: '#e2d7aa',
    fontSize: wp('20%'),
    fontFamily: 'JosefinSans-Bold',
  },
  bottomActive: {
    opacity: 1,
  },
  bottomDeactive: {
    opacity: 0.5,
  },
});

// const mapStateToProps = state => {
//   return {
//     chosenRoles: state.roles.chosenRoles,
//     numberOfPlayers: state.roles.numberOfPlayers,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     chooseRole: role => dispatch(chooseRole(role)),
//   };
// };

export default QuestsList;
