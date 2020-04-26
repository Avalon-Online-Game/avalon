import {wsConnected, wsDisconnected} from '../store/actions/index';
import {updateGameState} from '../store/actions/index';

const socketMiddleware = () => {
  let socket = null;

  const onOpen = store => event => {
    console.log('websocket opened', event);
    store.dispatch(wsConnected(event.target.url));
  };

  const onClose = store => () => {
    store.dispatch(wsDisconnected());
  };

  const onMessage = store => event => {
    const payload = JSON.parse(event.data);
    console.log('receiving server message');

    switch (payload.msg_type) {
      case 'update_game_state':
        store.dispatch(updateGameState(payload));
        break;
      default:
        break;
    }
  };

  return store => next => action => {
    switch (action.type) {
      case 'WS_CONNECT':
        if (socket !== null) {
          socket.close();
        }
        // connect to the remote host
        // eslint-disable-next-line no-undef
        socket = new WebSocket(
          `ws://localhost:8000/ws/game/?token=${action.token}`,
        );

        // websocket handlers
        socket.onmessage = onMessage(store);
        socket.onclose = onClose(store);
        socket.onopen = onOpen(store);
        break;
      case 'WS_DISCONNECT':
        if (socket !== null) {
          socket.close();
        }
        socket = null;
        console.log('websocket closed');
        break;
      default:
        return next(action);
    }
  };
};

export default socketMiddleware();
