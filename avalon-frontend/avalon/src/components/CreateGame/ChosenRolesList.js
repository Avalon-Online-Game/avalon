import React, {Component} from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  Image,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import Icon from 'react-native-vector-icons/Ionicons';
import * as Animatable from 'react-native-animatable';
import {connect} from 'react-redux';

import {removeRole} from '../../store/actions/index';
import DefaultColors from '../UI/colors';

const extractKey = ({id}) => id;

class ChosenRolesList extends Component {
  constructor(props) {
    super(props);
    this.chosenRolesRefs = {};
  }

  removeRoleHandler = item => {
    this.chosenRolesRefs[item.id].fadeOut(150).then(() => {
      this.props.removeRole(item);
    });
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
        <Animatable.View
          ref={ref => (this.chosenRolesRefs[item.id] = ref)}
          animation="fadeIn"
          easing="ease"
          duration={150}
          style={styles.chosenRole}>
          <ImageBackground
            source={item.image}
            style={styles.chosenRoleImage}
            resizeMode="contain">
            <TouchableWithoutFeedback
              style={styles.chosenRoleRemoveButton}
              onPress={() => this.removeRoleHandler(item, item.id)}>
              <Icon
                name="ios-remove-circle"
                color={DefaultColors.light}
                size={wp('8%')}
              />
            </TouchableWithoutFeedback>
          </ImageBackground>
        </Animatable.View>
      );
    return content;
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          ref={ref => (this.rolesList = ref)}
          style={styles.list}
          contentContainerStyle={styles.listContent}
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
