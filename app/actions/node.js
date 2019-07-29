import { send } from 'redux-electron-ipc';
import { push } from 'connected-react-router';
import type { Dispatch, GetState } from '../reducers/types';
import { connect } from '../ws/actions';
import { sendSync } from '../ws/client';
import routes from '../constants/routes';
import { wsEndpoint } from '../constants/config';

const WS_ENDPOINT = `ws://${wsEndpoint}`;

export const RUN_NODE = 'RUN_NODE';
export const NODE_RUNNING = 'NODE_RUNNING';
export const RUN_NODE_FAILED = 'RUN_NODE_FAILED';
export const TOKEN_RECEIVED = 'TOKEN_RECEIVED';
export const COMPLETE_ONBOARDING = 'COMPLETE_ONBOARDING';

export const runNode = () => (dispatch: Dispatch) => {
  dispatch(send(RUN_NODE));
};

export const connectToRunningNode = token => (dispatch: Dispatch) => {
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch({ type: NODE_RUNNING });
  dispatch(connect(WS_ENDPOINT));
};

export const onNodeRunning = () => (dispatch: Dispatch) => {
  dispatch({ type: NODE_RUNNING });
};

export const onRunNodeFailed = () => (dispatch: Dispatch) =>
  dispatch({ type: RUN_NODE_FAILED });

export const onTokenReceived = (event, token) => (dispatch: Dispatch) => {
  dispatch({ type: TOKEN_RECEIVED, payload: { token } });
  dispatch(connect(WS_ENDPOINT));
};

export const onSync = () => (dispatch: Dispatch, getState: GetState) => {
  const state = getState();
  const { settings } = state;
  if (settings.isTermsAccepted) dispatch({ type: COMPLETE_ONBOARDING });
  else dispatch(push(routes.BAGS_AND_TERMS));
};

export const validateCertificate = (
  spender: string,
  recipient: string,
  rvalue: string,
  utxo: string
) => (dispatch: Dispatch, getState: GetState) =>
  sendSync(
    { type: 'validate_certificate', spender, recipient, rvalue, utxo },
    getState
  );
