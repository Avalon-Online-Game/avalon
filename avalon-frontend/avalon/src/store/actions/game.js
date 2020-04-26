import {UPDATE_GAME_STATE} from './actionTypes';

export const updateGameState = data => {
  return {
    type: UPDATE_GAME_STATE,
    data: data,
  };
};
