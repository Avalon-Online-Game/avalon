import React, {Component} from 'react';
import {
  View,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import avatars from '../../utils/avatars';
import {chooseAvatar} from '../../store/actions/index';
import DefaultColors from '../UI/colors';

class AvatarsList extends Component {
  constructor(props) {
    super(props);
  }

  chooseAvatarHandler = avatar => {
    this.props.chooseAvatar(avatar);
  };

  avatarRenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.avatarButton}
        onPressIn={() => this.chooseAvatarHandler(item)}
        disabled={this.props.chosenAvatar === item ? true : false}>
        <Image
          source={item.image}
          style={[
            styles.avatarImage,
            this.props.chosenAvatar === item
              ? styles.avatarDeactive
              : styles.avatarActive,
          ]}
          resizeMode="contain"
        />
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={avatars}
          renderItem={this.avatarRenderItem}
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
  avatarButton: {
    alignItems: 'center',
    marginHorizontal: wp('3%'),
  },
  avatarImage: {
    width: hp('12%'),
    height: hp('12%'),
  },
  roleText: {
    color: DefaultColors.light,
    fontSize: wp('3.5%'),
    fontFamily: 'JosefinSans-Medium',
  },
  avatarActive: {
    opacity: 1,
  },
  avatarDeactive: {
    opacity: 0.5,
  },
});

const mapStateToProps = state => {
  return {
    chosenAvatar: state.user.chosenAvatar,
  };
};

const mapDispatchToProps = dispatch => {
  return {
    chooseAvatar: avatar => dispatch(chooseAvatar(avatar)),
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AvatarsList);
