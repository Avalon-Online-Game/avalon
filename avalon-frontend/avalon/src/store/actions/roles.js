import {CHOOSE_ROLE} from './actionTypes';
import {REMOVE_ROLE} from './actionTypes';
import {INCREASE_NUMBER_OF_PLAYERS} from './actionTypes';
import {DECREASE_NUMBER_OF_PLAYERS} from './actionTypes';

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

export const increaseNumberOfPlayers = () => {
  return {
    type: INCREASE_NUMBER_OF_PLAYERS,
  };
};

export const decreaseNumberOfPlayers = () => {
  return {
    type: DECREASE_NUMBER_OF_PLAYERS,
  };
};
