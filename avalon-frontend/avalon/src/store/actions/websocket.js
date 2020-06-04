import {WS_CONNECT} from './actionTypes';
import {WS_DISCONNECT} from './actionTypes';
import {WS_CONNECTED} from './actionTypes';
import {WS_DISCONNECTED} from './actionTypes';
import {WS_SEND} from './actionTypes';

export const wsConnect = token => {
  return {
    type: WS_CONNECT,
    token: token,
  };
};

export const wsDisconnect = () => {
  return {
    type: WS_DISCONNECT,
  };
};

export const wsConnected = () => {
  return {
    type: WS_CONNECTED,
  };
};

export const wsDisconnected = () => {
  return {
    type: WS_DISCONNECTED,
  };
};

export const wsSend = msg => {
  return {
    type: WS_SEND,
    msg: msg,
  };
};
