import {CHOOSE_ROLE} from './actionTypes';
import {REMOVE_ROLE} from './actionTypes';
import {SET_NUMBER_OF_PLAYERS} from './actionTypes';

export const chooseRole = role => {
  return {
    type: CHOOSE_ROLE,
    role: role,
  };
};

export const removeRole = role => {
  return {
    type: REMOVE_ROLE,
    role: role,
  };
};

export const setNumberOfPlayers = numberOfPlayers => {
  return {
    type: SET_NUMBER_OF_PLAYERS,
    numberOfPlayers: numberOfPlayers,
  };
};
