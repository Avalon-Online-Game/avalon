import {SET_PLAYER_TOKEN} from './actionTypes';
import {SET_GAME_QUESTS} from './actionTypes';
import {START_GAME} from './actionTypes';
import {UPDATE_GAME} from './actionTypes';
import {SET_QUEST_CHOSEN_PLAYERS} from './actionTypes';
import {SET_QUEST_VOTED_PLAYERS} from './actionTypes';
import {SET_QUEST_VOTE_RESULT} from './actionTypes';
import {SET_QUEST_RESULT} from './actionTypes';
import {SET_ASSASSINATION_RESULT} from './actionTypes';
import {SET_END_GAME} from './actionTypes';

export const setPlayerToken = token => {
  return {
    type: SET_PLAYER_TOKEN,
    token: token,
  };
};

export const setGameQuests = quests => {
  return {
    type: SET_GAME_QUESTS,
    quests: quests,
  };
};

export const startGame = data => {
  return {
    type: START_GAME,
    data: data,
  };
};

export const updateGame = data => {
  return {
    type: UPDATE_GAME,
    data: data,
  };
};

export const setQuestChosenPlayers = data => {
  return {
    type: SET_QUEST_CHOSEN_PLAYERS,
    data: data,
  };
};

export const setQuestVotedPlayers = data => {
  return {
    type: SET_QUEST_VOTED_PLAYERS,
    data: data,
  };
};

export const setQuestVoteResult = data => {
  return {
    type: SET_QUEST_VOTE_RESULT,
    data: data,
  };
};

export const setQuestResult = data => {
  return {
    type: SET_QUEST_RESULT,
    data: data,
  };
};

export const setAssassinationResult = data => {
  return {
    type: SET_ASSASSINATION_RESULT,
    data: data,
  };
};

export const setEndGame = data => {
  return {
    type: SET_END_GAME,
    data: data,
  };
};
