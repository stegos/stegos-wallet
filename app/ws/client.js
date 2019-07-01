import { MiddlewareAPI } from 'redux';
import crypto from 'crypto';
import type { Action, Dispatch, GetState } from '../reducers/types';
import { WS_CLOSED, WS_ERROR, WS_MESSAGE, WS_OPEN } from './actionsTypes';

let ws = null;
let isOpened = false;
let shouldReconnect = true;
let wsUrl: string | null = null;
const reconnectInterval: number = 2000; // todo param
let reconnectionInterval = null;
const algorithm = 'aes-128-ctr'; // todo config
const tokenLength = 16; // todo config

export const connect = (store: MiddlewareAPI, { payload }: Action) => {
  close();
  const { dispatch, getState } = store;
  const { url } = payload;
  wsUrl = url;
  ws = new WebSocket(url);
  ws.onopen = () => onOpen(dispatch);
  ws.onmessage = evt => onMessage(dispatch, getState, evt);
  ws.onclose = () => onClose(store);
  ws.onerror = () => onError(store);
};

export const disconnect = () => {
  if (ws) {
    close();
  } else {
    throw new Error('Socket connection not initialized.');
  }
};

export const send = (store: MiddlewareAPI, { payload }: Action) => {
  if (ws) {
    const state = store.getState();
    const { node } = state;
    const { apiToken } = node;
    if (!apiToken) return;
    ws.send(encrypt(JSON.stringify(payload), apiToken).toString('utf8'));
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

const onMessage = (
  dispatch: Dispatch,
  getState: GetState,
  evt: MessageEvent
) => {
  const state = getState();
  const { node } = state;
  const { apiToken } = node;
  if (!apiToken) return;
  const mes = decrypt(base64ToArrayBuffer(evt.data), apiToken);
  const data = JSON.parse(mes);
  dispatch({ type: WS_MESSAGE, payload: data }); // todo handle data
};

const onClose = (store: MiddlewareAPI) => {
  store.dispatch({ type: WS_CLOSED });
  if (isOpened || shouldReconnect) {
    reconnect(store);
  }
};

const onError = (store: MiddlewareAPI) => {
  store.dispatch({ type: WS_ERROR });
  if (isOpened || shouldReconnect) {
    reconnect(store);
  }
};

const reconnect = (store: MiddlewareAPI) => {
  ws = null;
  shouldReconnect = false;
  connect(
    store,
    { payload: { url: wsUrl } }
  );
  reconnectionInterval = setInterval(() => {
    // todo limit attempts
    connect(
      store,
      { payload: { url: wsUrl } }
    );
  }, reconnectInterval);
};

const encrypt = (plaintext, key) => {
  const resizedIV = Buffer.allocUnsafe(tokenLength);
  const iv = crypto
    .createHash('sha256')
    .update(plaintext)
    .digest();
  iv.copy(resizedIV);
  const encryptor = crypto.createCipheriv(
    algorithm,
    Buffer.from(base64ToArrayBuffer(key)),
    resizedIV
  );
  return arrayBufferToBase64(
    Buffer.concat([resizedIV, encryptor.update(plaintext), encryptor.final()])
  );
};

const decrypt = (buffer, key) => {
  const resizedIV = Buffer.allocUnsafe(tokenLength);
  Buffer.from(buffer, 0, tokenLength).copy(resizedIV);
  const ct = Buffer.from(buffer, tokenLength);
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(key, 'base64'),
    resizedIV
  );
  const dec = Buffer.concat([decipher.update(ct), decipher.final()]);
  return dec.toString('utf8');
};

const base64ToArrayBuffer = base64 => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i += 1) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const arrayBufferToBase64 = buffer => {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i += 1) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};
