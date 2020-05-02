import {START_GAME} from '../actions/actionTypes';

import roles from '../../utils/roles';

const initialState = {
  commander: '',
  questNumber: '',
  players: [],
  numberOfPlayers: undefined,
  role: '',
  roleData: [],
  websocket: null,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case START_GAME:
      const role = roles.find(
        item => item.id === action.data.player_state.role,
      );
      return {
        ...state,
        players: action.data.game_state.players,
        commander: action.data.game_state.commander,
        // questNumber: event.data.gameState.players,
        role: role,
        roleData: action.data.player_state.role_data,
        numberOfPlayers: action.data.game_state.number_of_players,
      };
    default:
      return state;
  }
};

export default reducer;
