import React, {Component} from 'react';
import {View, FlatList, Image, Text, StyleSheet} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';

import avatars from '../../utils/avatars';
import DefaultColors from '../UI/colors';

class RoleDataList extends Component {
  constructor(props) {
    super(props);
  }

  roleDataRenderItem = ({item}) => {
    return (
      <View style={styles.roleDataContainer}>
        <Image
          source={
            avatars.find(avatar => avatar.id === item.avatar.toString()).image
          }
          style={styles.roleDataImage}
          resizeMode="contain"
        />
        <Text style={styles.roleDataText}>{item.username}</Text>
      </View>
    );
  };

  render() {
    return (
      <View style={[styles.container, this.props.style]}>
        <FlatList
          style={styles.list}
          data={this.props.data}
          renderItem={this.roleDataRenderItem}
          keyExtractor={item => item.token}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: hp('14%'),
  },
  roleDataContainer: {
    marginHorizontal: wp('2%'),
    alignItems: 'center',
  },
  roleDataImage: {
    width: wp('20%'),
    height: wp('20%'),
  },
  roleDataText: {
    color: DefaultColors.light,
    fontSize: wp('4%'),
    fontFamily: 'JosefinSans-Regular',
    textAlign: 'center',
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
//     startGame: data => dispatch(startGame(data)),
//     wsConnect: token => dispatch(wsConnect(token)),
//     wsDisconnect: () => dispatch(wsDisconnect()),
//   };
// };

// export default connect(
//   mapStateToProps,
// mapDispatchToProps,
// )(RoleDataList);
export default RoleDataList;
