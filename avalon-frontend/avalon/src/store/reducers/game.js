import {UPDATE_GAME_STATE} from '../actions/actionTypes';

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
    case UPDATE_GAME_STATE:
      return {
        ...state,
        players: action.data.game_state.players,
        commander: action.data.game_state.commander,
        // questNumber: event.data.gameState.players,
        role: action.data.player_state.role,
        roleData: action.data.player_state.role_data,
        numberOfPlayers: action.data.game_state.number_of_players,
      };
    default:
      return state;
  }
};

export default reducer;
