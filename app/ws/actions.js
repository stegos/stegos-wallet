import { WS_CONNECT, WS_DISCONNECT, WS_SEND } from './actionsTypes';

export const connect = (url: string) => ({
  type: WS_CONNECT,
  payload: { url }
});
export const disconnect = () => ({ type: WS_DISCONNECT });
export const send = msg => ({ type: WS_SEND, payload: msg });
