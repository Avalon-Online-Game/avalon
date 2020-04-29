import React, {Component} from 'react';
import {View, FlatList, Image, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

const extractKey = ({id}) => id;

class RoleDataList extends Component {
  constructor(props) {
    super(props);
  }

  roleDataRenderItem = ({item}) => {
    return (
      <View style={styles.roleDataContainer}>
        <Image
          source={item.image}
          style={styles.roleDataImage}
          resizeMode="contain"
        />
        <Text style={styles.roleDataText}>{item.username}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          style={styles.list}
          data={this.data}
          renderItem={this.roleDataRenderItem}
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
    // backgroundColor: 'white',
  },
  roleDataContainer: {},
  roleDataImage: {},
  roleDataText: {
    color: '#e2d7aa',
    fontSize: wp('20%'),
    fontFamily: 'Dubai-Regular',
  },
});

// const mapStateToProps = state => {
//   return {
//     commander: state.game.commander,
//     questNumber: state.game.questNumber,
//     players: state.game.players,
//     numberOfPlayers: state.game.numberOfPlayers,
//     role: state.game.role,
//     roleData: state.game.roleData,
//   };
// };

// const mapDispatchToProps = dispatch => {
//   return {
//     updateGameState: data => dispatch(updateGameState(data)),
//     wsConnect: token => dispatch(wsConnect(token)),
//     wsDisconnect: () => dispatch(wsDisconnect()),
//   };
// };

// export default connect(
//   mapStateToProps,
// mapDispatchToProps,
// )(RoleDataList);
export default RoleDataList;
