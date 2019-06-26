import { MiddlewareAPI } from 'redux';
import type { Action, Dispatch } from '../reducers/types';
import { WS_CLOSED, WS_ERROR, WS_MESSAGE, WS_OPEN } from './actionsTypes';

let ws = null;
let isOpened = false;
let shouldReconnect = true;
let wsUrl: string | null = null;
const reconnectInterval: number = 2000; // todo param
let reconnectionInterval = null;

export const connect = ({ dispatch }: MiddlewareAPI, { payload }: Action) => {
  close();
  const { url } = payload;
  wsUrl = url;
  ws = new WebSocket(url);
  ws.onopen = () => onOpen(dispatch);
  ws.onmessage = evt => onMessage(dispatch, evt);
  ws.onclose = () => onClose(dispatch);
  ws.onerror = () => onError(dispatch);
};

export const disconnect = () => {
  if (ws) {
    close();
  } else {
    throw new Error('Socket connection not initialized.');
  }
};

export const send = (_store: MiddlewareAPI, { payload }: Action) => {
  if (ws) {
    ws.send(JSON.stringify(payload));
  } else {
    throw new Error('Socket connection not initialized.');
  }
};

const close = (code?: number, reason?: string) => {
  if (ws) {
    ws.close(code || 1000, reason || 'WebSocket connection closed.');
    ws = null;
    isOpened = false;
  }
};

const onOpen = (dispatch: Dispatch) => {
  if (reconnectionInterval) {
    clearInterval(reconnectionInterval);
    reconnectionInterval = null;
  }
  dispatch({ type: WS_OPEN });
  isOpened = true;
};

const onMessage = (dispatch: Dispatch, evt: MessageEvent) => {
  const data = JSON.parse(evt.data);
  dispatch({ type: WS_MESSAGE, payload: data }); // todo handle data
};

const onClose = (dispatch: Dispatch) => {
  dispatch({ type: WS_CLOSED });
};

const onError = (dispatch: Dispatch) => {
  dispatch({ type: WS_ERROR });
  if (isOpened || shouldReconnect) {
    reconnect(dispatch);
  }
};

const reconnect = (dispatch: Dispatch) => {
  ws = null;
  shouldReconnect = false;
  connect(
    { dispatch },
    { payload: { url: wsUrl } }
  );
  reconnectionInterval = setInterval(() => {
    // todo limit attempts
    connect(
      { dispatch },
      { payload: { url: wsUrl } }
    );
  }, reconnectInterval);
};
