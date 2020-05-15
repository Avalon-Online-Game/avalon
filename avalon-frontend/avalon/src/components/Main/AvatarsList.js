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

class AvatarsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      chosenAvatar: undefined,
    };
  }

  chooseAvatarHandler = avatar => {
    this.setState({
      chosenAvatar: avatar,
    });
  };

  avatarRenderItem = ({item}) => {
    return (
      <TouchableOpacity
        style={styles.avatarButton}
        onPressIn={() => this.chooseAvatarHandler(item)}
        disabled={this.state.chosenAvatar === item ? true : false}>
        <Image
          source={item.image}
          style={[
            styles.avatarImage,
            this.state.chosenAvatar === item
              ? styles.avatarActive
              : styles.avatarDeactive,
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
    height: hp('15%'),
    width: hp('15%'),
  },
  roleText: {
    color: '#e2d7aa',
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
