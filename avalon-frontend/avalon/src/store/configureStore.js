import {createStore, combineReducers} from 'redux';

import rolesReducer from './reducers/roles';

const rootReducer = combineReducers({
  roles: rolesReducer,
});

const configureStore = () => {
  return createStore(rootReducer);
};

export default configureStore;
