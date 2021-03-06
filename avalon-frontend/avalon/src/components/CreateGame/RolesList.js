import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableWithoutFeedback,
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
import DefaultColors from '../UI/colors';

class RolesList extends Component {
  constructor(props) {
    super(props);
    this.data =
      this.props.side === 'evil'
        ? roles.filter(role => role.side === 'evil')
        : this.props.side === 'good'
        ? roles.filter(role => role.side === 'good')
        : undefined;
  }

  chooseRoleHandler = role => {
    if (
      this.props.chosenRoles.filter(item => item.id === role.id).length === 0
    ) {
      this.props.chooseRole(role);
    }
  };

  isRoleDisabled = item => {
    if (
      this.props.chosenRoles.filter(role => role.id === item.id).length !== 0 ||
      this.props.chosenRoles.length ===
        parseInt(this.props.numberOfPlayers, 10) ||
      this.props.chosenRoles.filter(role => role.side === item.side).length ===
        game(this.props.numberOfPlayers)[item.side]
    ) {
      return true;
    }
    return false;
  };

  roleRenderItem = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() => this.chooseRoleHandler(item)}
        disabled={this.isRoleDisabled(item)}>
        <View style={styles.roleButton}>
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
        </View>
      </TouchableWithoutFeedback>
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
    color: DefaultColors.light,
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
