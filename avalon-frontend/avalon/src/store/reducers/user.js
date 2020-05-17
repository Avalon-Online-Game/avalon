import {CHOOSE_AVATAR} from '../actions/actionTypes';

import avatars from '../../utils/avatars';

const initialState = {
  chosenAvatar: avatars[0],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_AVATAR:
      return {
        ...state,
        chosenAvatar: action.avatar,
      };
    default:
      return state;
  }
};

export default reducer;
