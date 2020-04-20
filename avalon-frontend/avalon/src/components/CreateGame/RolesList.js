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

const goods = [
  {
    id: 'merlin',
    text: 'Merlin',
    image: require('../../assets/goods/merlin.png'),
  },
  {
    id: 'percival',
    text: 'Percival',
    image: require('../../assets/goods/percival.png'),
  },
  {
    id: 'loyal1',
    text: 'Richard',
    image: require('../../assets/goods/loyal1.png'),
  },
  {
    id: 'loyal2',
    text: 'Mattheus',
    image: require('../../assets/goods/loyal2.png'),
  },
  {
    id: 'loyal3',
    text: 'Christian',
    image: require('../../assets/goods/loyal3.png'),
  },
  {
    id: 'loyal4',
    text: 'David',
    image: require('../../assets/goods/loyal4.png'),
  },
  {
    id: 'loyal5',
    text: 'Maria',
    image: require('../../assets/goods/loyal5.png'),
  },
];

const evils = [
  {
    id: 'mordred',
    text: 'Mordred',
    image: require('../../assets/evils/mordred.png'),
  },
  {
    id: 'morgana',
    text: 'Morgana',
    image: require('../../assets/evils/morgana.png'),
  },
  {
    id: 'oberon',
    text: 'Oberon',
    image: require('../../assets/evils/oberon.png'),
  },
  {
    id: 'assassin',
    text: 'Assassin',
    image: require('../../assets/evils/assassin.png'),
  },
  {
    id: 'minion1',
    text: 'Minion',
    image: require('../../assets/evils/minion1.png'),
  },
  {
    id: 'minion2',
    text: 'Minion',
    image: require('../../assets/evils/minion2.png'),
  },
  {
    id: 'minion3',
    text: 'Minion',
    image: require('../../assets/evils/minion3.png'),
  },
];

const extractKey = ({id}) => id;

class RolesList extends Component {
  constructor(props) {
    super(props);
    this.data =
      this.props.side === 'evil'
        ? evils
        : this.props.side === 'good'
        ? goods
        : undefined;
  }

  chooseRoleHandler = role => {
    if (
      this.props.chosenRoles.filter(item => item.id === role.id).length === 0
    ) {
      this.props.chooseRole(role);
    }
  };

  roleRenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.roleButton}
        onPressIn={() => this.chooseRoleHandler(item)}>
        <Image
          source={item.image}
          style={[
            styles.roleImage,
            this.props.chosenRoles.filter(role => item.id === role.id)
              .length === 0
              ? {opacity: 1}
              : {opacity: 0.5},
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
          extraData={this.props.chosenRoles}
          renderItem={this.roleRenderItem}
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
});

const mapStateToProps = state => {
  return {
    chosenRoles: state.roles.chosenRoles,
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
