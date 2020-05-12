import React, {Component} from 'react';
import {View, FlatList, StyleSheet, Image} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {connect} from 'react-redux';

import votings from '../../utils/votings';

class VotingsList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: votings.slice(0, this.props.failedVotings),
    };
  }

  componentDidUpdate = prevProps => {
    if (prevProps.failedVotings !== this.props.failedVotings) {
      this.setState({
        data: votings.slice(0, this.props.failedVotings),
      });
    }
  };

  votingRenderItem = ({item}) => {
    return (
      <View style={styles.votingImageContainer}>
        <Image
          style={styles.votingImage}
          source={item.image}
          resizeMode="contain"
        />
      </View>
    );
  };

  render() {
    return (
      <View style={this.props.style}>
        <FlatList
          style={styles.list}
          contentContainerStyle={styles.listContent}
          data={this.state.data}
          extraData={this.state.data}
          renderItem={this.votingRenderItem}
          keyExtractor={item => item.id.toString()}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  list: {},
  listContent: {
    alignItems: 'center',
  },
  votingImageContainer: {
    marginHorizontal: wp('2%'),
  },
  votingImage: {
    width: wp('17%'),
    height: wp('17%'),
  },
});

const mapStateToProps = state => {
  return {
    failedVotings: state.game.failedVotings,
  };
};

export default connect(mapStateToProps)(VotingsList);
