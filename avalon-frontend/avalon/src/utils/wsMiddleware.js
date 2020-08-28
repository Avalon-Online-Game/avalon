import ReconnectingWebsocket from 'reconnecting-websocket';

import {WS_CONNECT, WS_DISCONNECT, WS_SEND} from '../store/actions/actionTypes';
import {wsConnected, wsDisconnected, wsSend} from '../store/actions/index';
import {
  startGame,
  updateGame,
  setQuestChosenPlayers,
  setQuestVotedPlayers,
  setQuestVoteResult,
  setQuestScoredPlayers,
  setQuestResult,
  setAssassinationState,
  setAssassinationResult,
  setEndGame,
  setPlayerLeft,
  setPlayerDisconnected,
} from '../store/actions/index';

const socketMiddleware = () => {
  const baseUrl = __DEV__ ? 'ws://localhost:8000/' : 'wss://avalongame.ir/';

  let socket = null;

  const onOpen = store => event => {
    store.dispatch(wsConnected());
  };

  const onClose = store => () => {
    store.dispatch(wsDisconnected());
  };

  const onMessage = store => event => {
    const payload = JSON.parse(event.data);

    switch (payload.msg_type) {
      case 'start':
        store.dispatch(startGame(payload));
        break;
      case 'update':
        store.dispatch(updateGame(payload));
        break;
      case 'quest_choice':
        store.dispatch(setQuestChosenPlayers(payload));
        break;
      case 'quest_vote':
        store.dispatch(setQuestVotedPlayers(payload));
        break;
      case 'quest_vote_result':
        store.dispatch(setQuestVoteResult(payload));
        break;
      case 'quest_score':
        store.dispatch(setQuestScoredPlayers(payload));
        break;
      case 'quest_result':
        store.dispatch(setQuestResult(payload));
        break;
      case 'assassination':
        store.dispatch(setAssassinationState(payload));
        break;
      case 'assassination_result':
        store.dispatch(setAssassinationResult(payload));
        break;
      case 'end':
        store.dispatch(setEndGame(payload));
        break;
      case 'leave': {
        store.dispatch(setPlayerLeft(payload));
        const msg = {
          msg_type: 'leave',
        };
        store.dispatch(wsSend(msg));
        break;
      }
      case 'disconnect':
        store.dispatch(setPlayerDisconnected(payload));
        break;
      default:
        break;
    }
  };

  return store => next => action => {
    switch (action.type) {
      case WS_CONNECT:
        if (socket !== null) {
          socket.close();
        }
        let wsOptions = {
          maxReconnectionDelay: 10000,
          minReconnectionDelay: 1000 + Math.random() * 4000,
          reconnectionDelayGrowFactor: 1.3,
          minUptime: 5000,
          connectionTimeout: 4000,
          maxRetries: Infinity,
          maxEnqueuedMessages: Infinity,
          startClosed: false,
          debug: __DEV__,
        };
        socket = new ReconnectingWebsocket(
          `${baseUrl}ws/game/?token=${action.token}`,
          [],
          wsOptions,
        );
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);
        break;

      case WS_DISCONNECT:
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        break;

      case WS_SEND:
        socket.send(JSON.stringify(action.msg));
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();
