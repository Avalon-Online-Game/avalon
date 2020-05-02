import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

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
    {id: 1, number: '2', image: require('../../assets/board/quest1.png')},
    {id: 2, number: '3', image: require('../../assets/board/quest2.png')},
    {id: 3, number: '2', image: require('../../assets/board/quest3.png')},
    {id: 4, number: '3', image: require('../../assets/board/quest4.png')},
    {id: 5, number: '3', image: require('../../assets/board/quest5.png')},
  ];

  quests6 = [
    {id: 1, number: '2', image: require('../../assets/board/quest1.png')},
    {id: 2, number: '3', image: require('../../assets/board/quest2.png')},
    {id: 3, number: '4', image: require('../../assets/board/quest3.png')},
    {id: 4, number: '3', image: require('../../assets/board/quest4.png')},
    {id: 5, number: '4', image: require('../../assets/board/quest5.png')},
  ];

  quests7 = [
    {id: 1, number: '2', image: require('../../assets/board/quest1.png')},
    {id: 2, number: '3', image: require('../../assets/board/quest2.png')},
    {id: 3, number: '3', image: require('../../assets/board/quest3.png')},
    {
      id: 4,
      number: '4',
      detail: 'Two fails required',
      image: require('../../assets/board/quest4.png'),
    },
    {id: 5, number: '4', image: require('../../assets/board/quest5.png')},
  ];

  quests8 = [
    {id: 1, number: '3', image: require('../../assets/board/quest1.png')},
    {id: 2, number: '4', image: require('../../assets/board/quest2.png')},
    {id: 3, number: '4', image: require('../../assets/board/quest3.png')},
    {
      id: 4,
      number: '5',
      detail: 'Two fails required',
      image: require('../../assets/board/quest4.png'),
    },
    {id: 5, number: '5', image: require('../../assets/board/quest5.png')},
  ];

  quests9 = [
    {id: 1, number: '3', image: require('../../assets/board/quest1.png')},
    {id: 2, number: '4', image: require('../../assets/board/quest2.png')},
    {id: 3, number: '4', image: require('../../assets/board/quest3.png')},
    {
      id: 4,
      number: '5',
      detail: 'Two fails required',
      image: require('../../assets/board/quest4.png'),
    },
    {id: 5, number: '5', image: require('../../assets/board/quest5.png')},
  ];

  quests10 = [
    {id: 1, number: '3', image: require('../../assets/board/quest1.png')},
    {id: 2, number: '4', image: require('../../assets/board/quest2.png')},
    {id: 3, number: '4', image: require('../../assets/board/quest3.png')},
    {id: 4, number: '5', image: require('../../assets/board/quest4.png')},
    {id: 5, number: '5', image: require('../../assets/board/quest5.png')},
  ];

  seeQuestHandler = quest => {};

  questRenderItem = ({item}) => {
    let detail;
    if (typeof item.detail !== undefined) {
      detail = <Text style={styles.questDetail}>{item.detail}</Text>;
    } else {
      detail = null;
    }
    return (
      <View>
        {detail}
        <TouchableOpacity
          style={styles.questButton}
          onPressIn={() => this.seeQuestHandler(item)}>
          <ImageBackground
            source={item.image}
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
          extraData={[this.data, this.props.numberOfPlayers]}
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
  list: {
    // backgroundColor: 'white',
  },
  listContent: {
    alignItems: 'center',
  },
  questButton: {
    marginHorizontal: wp('2%'),
  },
  questBackground: {
    width: hp('20%'),
    height: hp('20%'),
    alignItems: 'center',
    justifyContent: 'center',
  },
  questNumber: {
    color: '#e2d7aa',
    fontSize: wp('20%'),
    fontFamily: 'Dubai-Regular',
  },
  questDetail: {
    color: '#e2d7aa',
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
