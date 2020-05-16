import {CHOOSE_ROLE} from '../actions/actionTypes';
import {REMOVE_ROLE} from '../actions/actionTypes';
import {INCREASE_NUMBER_OF_PLAYERS} from '../actions/actionTypes';
import {DECREASE_NUMBER_OF_PLAYERS} from '../actions/actionTypes';

import roles from '../../utils/roles';

const initialState = {
  chosenRoles: roles.filter(role => 'required' in role),
  numberOfPlayers: 5,
  maxNumberOfPlayers: 10,
  minNumberOfPlayers: 5,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHOOSE_ROLE:
      return {
        ...state,
        chosenRoles: state.chosenRoles.concat(action.role),
      };
    case REMOVE_ROLE:
      return {
        ...state,
        chosenRoles: state.chosenRoles.filter(role => {
          return role.id !== action.role.id;
        }),
      };
    case INCREASE_NUMBER_OF_PLAYERS:
      return {
        ...state,
        numberOfPlayers: state.numberOfPlayers + 1,
      };
    case DECREASE_NUMBER_OF_PLAYERS:
      return {
        ...state,
        numberOfPlayers: state.numberOfPlayers - 1,
      };
    default:
      return state;
  }
};

export default reducer;
