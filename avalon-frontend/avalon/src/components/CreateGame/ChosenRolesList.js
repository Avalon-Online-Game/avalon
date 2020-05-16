import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ImageBackground,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import {connect} from 'react-redux';

import {removeRole} from '../../store/actions/index';

const extractKey = ({id}) => id;

class ChosenRolesList extends Component {
  constructor(props) {
    super(props);
  }

  removeRoleHandler = item => {
    this.props.removeRole(item);
  };

  chosenRoleRenderItem = ({item}) => {
    const content =
      'required' in item ? (
        <View style={styles.chosenRole}>
          <Image
            source={item.image}
            style={styles.chosenRoleImage}
            resizeMode="contain"
          />
        </View>
      ) : (
        <View style={styles.chosenRole}>
          <ImageBackground
            source={item.image}
            style={styles.chosenRoleImage}
            resizeMode="contain">
            <TouchableOpacity
              style={styles.chosenRoleRemoveButton}
              onPress={() => this.removeRoleHandler(item)}>
              <Icon name="ios-remove-circle" color="#e2d7aa" size={wp('8%')} />
            </TouchableOpacity>
          </ImageBackground>
        </View>
      );
    return content;
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          ref={ref => (this.rolesList = ref)}
          data={this.props.chosenRoles}
          extraData={this.props.chosenRoles}
          renderItem={this.chosenRoleRenderItem}
          keyExtractor={extractKey}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          onEndReached={() => {
            this.rolesList.scrollToEnd({animated: true});
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  chosenRole: {
    marginLeft: wp('2%'),
  },
  chosenRoleRemoveButton: {},
  chosenRoleImage: {
    marginLeft: wp('0.5%'),
    height: hp('11%'),
    width: hp('11%'),
  },
});

const mapStateToProps = state => {
  return {
    chosenRoles: state.roles.chosenRoles,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    removeRole: role => dispatch(removeRole(role)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ChosenRolesList);
