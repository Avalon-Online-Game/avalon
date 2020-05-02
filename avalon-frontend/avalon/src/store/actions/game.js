import {START_GAME} from './actionTypes';

export const startGame = data => {
  return {
    type: START_GAME,
    data: data,
  };
};
