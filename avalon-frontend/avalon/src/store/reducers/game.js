import {SET_PLAYER_TOKEN} from '../actions/actionTypes';
import {SET_GAME_QUESTS} from '../actions/actionTypes';
import {START_GAME} from '../actions/actionTypes';
import {UPDATE_GAME} from '../actions/actionTypes';
import {SET_QUEST_CHOSEN_PLAYERS} from '../actions/actionTypes';
import {SET_QUEST_VOTED_PLAYERS} from '../actions/actionTypes';
import {SET_QUEST_VOTE_RESULT} from '../actions/actionTypes';
import {SET_QUEST_RESULT} from '../actions/actionTypes';
import {SET_ASSASSINATION_STATE} from '../actions/actionTypes';
import {SET_ASSASSINATION_RESULT} from '../actions/actionTypes';
import {SET_END_GAME} from '../actions/actionTypes';

import roles from '../../utils/roles';

const initialState = {
  playerToken: '',
  players: [],
  commander: '',
  quests: [],
  numberOfPlayers: undefined,
  currentQuestNumber: undefined,
  failedVotings: undefined,
  gameState: '',
  winner: '',
  role: '',
  roleData: [],
  questChosenPlayers: [],
  questVotedPlayers: [],
  questVotingResult: '',
  questPlayersVotes: [],
  questScores: undefined,
  questResult: '',
  assassinationChoices: [],
  assassinatedPlayer: undefined,
  assassinationResult: '',
  gameQuests: [],
  // disconnectedPlayers: [],
  // leftPlayers: [],
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GAME_QUESTS: {
      return {
        ...state,
        gameQuests: action.quests,
      };
    }
    case SET_PLAYER_TOKEN: {
      return {
        ...state,
        playerToken: action.token,
      };
    }
    case START_GAME: {
      const role = roles.find(item => item.id === action.data.player.role);
      return {
        ...state,
        players: action.data.game_state.players,
        commander: action.data.game_state.commander,
        quests: action.data.game_state.quests,
        numberOfPlayers: action.data.game_state.number_of_players,
        currentQuestNumber: action.data.game_state.quest_number,
        failedVotings: action.data.game_state.failed_votings,
        gameState: action.data.game_state.state,
        winner: action.data.game_state.winner,
        role: role,
        roleData: action.data.player.role_data,
        questChosenPlayers: action.data.game_state.quest_chosen_players,
        questVotedPlayers: action.data.game_state.quest_voted_players,
      };
    }
    case UPDATE_GAME: {
      return {
        ...state,
        commander: action.data.game_state.commander,
        quests: action.data.game_state.quests,
        currentQuestNumber: action.data.game_state.quest_number,
        failedVotings: action.data.game_state.failed_votings,
        gameState: action.data.game_state.state,
        winner: action.data.game_state.winner,
        questChosenPlayers: action.data.game_state.quest_chosen_players,
      };
    }
    case SET_QUEST_CHOSEN_PLAYERS: {
      return {
        ...state,
        questChosenPlayers: action.data.game_state.quest_chosen_players,
        commander: action.data.game_state.commander,
        quests: action.data.game_state.quests,
        currentQuestNumber: action.data.game_state.quest_number,
        failedVotings: action.data.game_state.failed_votings,
        gameState: action.data.game_state.state,
        // winner: action.data.game_state.winner,
      };
    }
    case SET_QUEST_VOTED_PLAYERS: {
      return {
        ...state,
        questChosenPlayers: action.data.game_state.quest_chosen_players,
        questVotedPlayers: action.data.game_state.quest_voted_players,
        // commander: action.data.game_state.commander,
        // quests: action.data.game_state.quests,
        // currentQuestNumber: action.data.game_state.quest_number,
        // failedVotings: action.data.game_state.failed_votings,
        gameState: action.data.game_state.state,
        // winner: action.data.game_state.winner,
      };
    }
    case SET_QUEST_VOTE_RESULT: {
      return {
        ...state,
        questChosenPlayers: action.data.game_state.quest_chosen_players,
        questPlayersVotes: action.data.game_state.quest_votes,
        questVotingResult: action.data.game_state.quest_voting_result,
        commander: action.data.game_state.commander,
        quests: action.data.game_state.quests,
        currentQuestNumber: action.data.game_state.quest_number,
        failedVotings: action.data.game_state.failed_votings,
        gameState: action.data.game_state.state,
        // winner: action.data.game_state.winner,
      };
    }
    case SET_QUEST_RESULT: {
      return {
        ...state,
        questResult:
          action.data.game_state.quests[state.currentQuestNumber - 1].result,
        questScores:
          action.data.game_state.quests[state.currentQuestNumber - 1].scores,
        commander: action.data.game_state.commander,
        quests: action.data.game_state.quests,
        currentQuestNumber: action.data.game_state.quest_number,
        failedVotings: action.data.game_state.failed_votings,
        gameState: action.data.game_state.state,
        // winner: action.data.game_state.winner,
      };
    }
    case SET_ASSASSINATION_STATE: {
      return {
        ...state,
        assassinationChoices: action.data.assassination_choices,
        gameState: action.data.game_state.state,
      };
    }
    case SET_ASSASSINATION_RESULT: {
      return {
        ...state,
        assassinatedPlayer: action.data.assassinated_player,
        assassinationResult: action.data.assassination_result,
        gameState: action.data.game_state.state,
      };
    }
    case SET_END_GAME: {
      return {
        ...state,
        winner: action.data.game_state.winner,
        playersRoles: action.data.players_roles,
        gameState: action.data.game_state.state,
      };
    }
    // case SET_DISCONNECTED_PLAYERS: {
    //   return {
    //     ...state,
    //     disconnectedPlayers: state.disconnectedPlayers.push(action.data.player),
    //     gameState: action.data.game_state.state,
    //   };
    // }
    // case SET_LEFT_PLAYERS: {
    //   return {
    //     ...state,
    //     leftPlayers: state.leftPlayers.push(action.data.player),
    //     gameState: action.data.game_state.state,
    //   };
    // }
    default:
      return state;
  }
};

export default reducer;
