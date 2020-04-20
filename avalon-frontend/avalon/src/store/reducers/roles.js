import {CHOOSE_ROLE} from '../actions/actionTypes';
import {REMOVE_ROLE} from '../actions/actionTypes';

const initialState = {
  chosenRoles: [],
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
    default:
      return state;
  }
};

export default reducer;
