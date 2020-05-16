import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  Text,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import {chooseRole} from '../../store/actions/index';
import roles from '../../utils/roles';
import game from '../../utils/game';

class RolesList extends Component {
  constructor(props) {
    super(props);
    this.data =
      this.props.side === 'evil'
        ? roles.filter(role => role.side === 'evil')
        : this.props.side === 'good'
        ? roles.filter(role => role.side === 'good')
        : undefined;
    this.game = game(this.props.numberOfPlayers);
  }

  chooseRoleHandler = role => {
    if (
      this.props.chosenRoles.filter(item => item.id === role.id).length === 0
    ) {
      this.props.chooseRole(role);
    }
  };

  isRoleDisabled = item => {
    console.log(this.props.chosenRoles.filter(role => role.side === item.side));
    console.log(this.game[item.side]);
    if (
      this.props.chosenRoles.filter(role => role.id === item.id).length !== 0 ||
      this.props.chosenRoles.length ===
        parseInt(this.props.numberOfPlayers, 10) ||
      this.props.chosenRoles.filter(role => role.side === item.side).length ===
        this.game[item.side]
    ) {
      return true;
    }
    return false;
  };

  roleRenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.roleButton}
        onPressIn={() => this.chooseRoleHandler(item)}
        disabled={this.isRoleDisabled(item)}>
        <Image
          source={item.image}
          style={[
            styles.roleImage,
            this.isRoleDisabled(item)
              ? styles.buttonDeactive
              : styles.buttonActive,
          ]}
          resizeMode="contain"
        />
        <Text style={styles.roleText}>{item.text}</Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={this.data}
          extraData={[this.props.chosenRoles, this.props.numberOfPlayers]}
          renderItem={this.roleRenderItem}
          keyExtractor={item => item.id}
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
    justifyContent: 'center',
  },
  roleButton: {
    alignItems: 'center',
    marginHorizontal: wp('3%'),
  },
  roleImage: {
    height: hp('15%'),
    width: hp('15%'),
  },
  roleText: {
    color: '#e2d7aa',
    fontSize: wp('3.5%'),
    fontFamily: 'JosefinSans-Medium',
  },
  buttonActive: {
    opacity: 1,
  },
  buttonDeactive: {
    opacity: 0.5,
  },
});

const mapStateToProps = state => {
  return {
    chosenRoles: state.roles.chosenRoles,
    numberOfPlayers: state.roles.numberOfPlayers,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseRole: role => dispatch(chooseRole(role)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(RolesList);
