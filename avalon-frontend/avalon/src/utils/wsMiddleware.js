import {WS_CONNECT, WS_DISCONNECT, WS_SEND} from '../store/actions/actionTypes';
import {
  wsConnected,
  wsDisconnected,
  wsDisconnect,
  wsSend,
} from '../store/actions/index';
import {
  startGame,
  updateGame,
  setQuestChosenPlayers,
  setQuestVotedPlayers,
  setQuestVoteResult,
  setQuestResult,
  setAssassinationState,
  setAssassinationResult,
  setEndGame,
  setPlayerLeft,
  setPlayerDisconnected,
} from '../store/actions/index';

const socketMiddleware = () => {
  let socket = null;

  const onOpen = store => event => {
    console.log('websocket opened');
    store.dispatch(wsConnected());
  };

  const onClose = store => () => {
    store.dispatch(wsDisconnected());
  };

  const onMessage = store => event => {
    const payload = JSON.parse(event.data);
    console.log('receiving server message');

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
        // eslint-disable-next-line no-undef
        socket = new WebSocket(
          `ws://localhost:8000/ws/game/?token=${action.token}`,
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
        console.log('websocket closed');
        break;
      case WS_SEND:
        console.log('sending a message', action.msg);
        socket.send(JSON.stringify(action.msg));
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();
