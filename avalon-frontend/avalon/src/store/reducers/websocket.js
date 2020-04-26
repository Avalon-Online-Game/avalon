import {WS_CONNECTED} from '../actions/actionTypes';
import {WS_DISCONNECTED} from '../actions/actionTypes';

const initialState = {
  wsConnection: false,
  wsHost: '',
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case WS_CONNECTED:
      return {
        ...state,
        wsConnection: true,
        wsHost: action.host,
      };
    case WS_DISCONNECTED:
      return {
        ...state,
        wsConnection: false,
        wsHost: '',
      };
    default:
      return state;
  }
};

export default reducer;
