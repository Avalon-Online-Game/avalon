import {WS_CONNECTED} from '../actions/actionTypes';
import {WS_DISCONNECTED} from '../actions/actionTypes';

const initialState = {
  wsConnection: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case WS_CONNECTED:
      return {
        ...state,
        wsConnection: true,
      };
    case WS_DISCONNECTED:
      return {
        ...state,
        wsConnection: false,
      };
    default:
      return state;
  }
};

export default reducer;
