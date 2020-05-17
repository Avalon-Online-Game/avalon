import {createStore, combineReducers, applyMiddleware} from 'redux';

import rolesReducer from './reducers/roles';
import gameReducer from './reducers/game';
import websocketReducer from './reducers/websocket';
import userReducer from './reducers/user';
import wsMiddleware from '../utils/wsMiddleware';

const rootReducer = combineReducers({
  roles: rolesReducer,
  game: gameReducer,
  websocket: websocketReducer,
  user: userReducer,
});

const configureStore = () => {
  return createStore(rootReducer, applyMiddleware(wsMiddleware));
};

export default configureStore;
