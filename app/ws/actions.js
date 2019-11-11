import { WS_CONNECT, WS_DISCONNECT, WS_SEND } from './actionsTypes';
import type { Dispatch } from '../reducers/types';

export const connect = (
  url: string,
  token: string,
  onOpen: (dispatch: Dispatch) => void
) => ({
  type: WS_CONNECT,
  payload: { url, token, onOpen }
});
export const disconnect = () => ({ type: WS_DISCONNECT });
export const send = msg => ({ type: WS_SEND, payload: msg });
