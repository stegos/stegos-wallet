/* eslint global-require: off */

/**
 * This module executes inside of electron's main process. You can start
 * electron renderer process from here and communicate with the other processes
 * through IPC.
 *
 * When running `yarn build` or `yarn build-main`, this file is compiled to
 * `./app/main.prod.js` using webpack. This gives us some performance wins.
 *
 * @flow
 */
import { app, BrowserWindow, ipcMain } from 'electron';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import getPath from 'platform-folders';
import MenuBuilder from './menu';
import { TOKEN_RECEIVED } from './actions/node';
import { wsEndpoint } from './constants/config';
import parseArgs from './utils/argv';
import { checkUpdateAndNotify } from './utils/updater';
import type { Network } from './reducers/types';

const WebSocket = require('ws');

app.commandLine.appendSwitch('high-dpi-support', 'true');

let mainWindow = null;
let nodeProcess = null;

if (process.env.NODE_ENV === 'production') parseArgs();

const nodePath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../node/')
    : path.resolve(__dirname, '../node/');
const defaultStegosPath = `${getPath('appData')}/stegos`;
const tokenFilePath = `${defaultStegosPath}/api.token`;
const logFile = `${defaultStegosPath}/stegos.log`;
const apiEndpoint = process.env.APIENDPOINT || wsEndpoint;
const argChain = process.env.CHAIN;
let externalNodeNetwork = null;

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

/**
 * Add event listeners...
 */

app.on('window-all-closed', () => {
  // Respect the OSX convention of having the application in memory even
  // after all windows have been closed
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('ready', async () => {
  mainWindow = new BrowserWindow({
    show: false,
    width: 1440,
    height: 877,
    minWidth: 960,
    minHeight: 320,
    icon: path.join(__dirname, '../resources/icons/64x64.png')
  });

  mainWindow.loadURL(`file://${__dirname}/app.html`);

  // @TODO: Use 'ready-to-show' event
  //        https://github.com/electron/electron/blob/master/docs/api/browser-window.md#using-ready-to-show-event
  mainWindow.webContents.on('did-finish-load', () => {
    if (!mainWindow) {
      throw new Error('"mainWindow" is not defined');
    }
    if (process.env.START_MINIMIZED) {
      mainWindow.minimize();
    } else {
      mainWindow.show();
      mainWindow.focus();
    }
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  const menuBuilder = new MenuBuilder(mainWindow);
  menuBuilder.buildMenu();

  checkUpdateAndNotify();
});

app.on('quit', () => {
  killNode();
  app.exit(0);
});

/**
 * IPC listeners
 */

ipcMain.on('GET_NODE_PARAMS', async event => {
  if (argChain) {
    event.sender.send('SET_NODE_PARAMS', {
      isPreconfigured: true,
      chain: argChain
    });
    return;
  }
  try {
    externalNodeNetwork = await checkWSConnect();
    event.sender.send('SET_NODE_PARAMS', {
      isPreconfigured: !!externalNodeNetwork,
      chain: externalNodeNetwork
    });
  } catch (e) {
    console.log(e);
    event.sender.send('SET_NODE_PARAMS', { isPreconfigured: false });
  }
});

ipcMain.on('CONNECT_OR_RUN_NODE', async (event, args) => {
  try {
    if (argChain || !externalNodeNetwork) {
      await runNodeProcess(argChain || args.chain);
    }
    captureToken();
  } catch (e) {
    console.log(e);
    event.sender.send('RUN_NODE_FAILED', { error: e });
  }
});

ipcMain.on('RELAUNCH_NODE', async (event, args) => {
  killNode();
  try {
    await runNodeProcess(argChain || args.chain);
    captureToken();
  } catch (e) {
    console.log(e);
    event.sender.send('RUN_NODE_FAILED', { error: e });
  }
});

function runNodeProcess(chain: string): Promise<void> {
  const args = ['--chain', chain, '--api-endpoint', apiEndpoint, '--light'];
  return new Promise((resolve, reject) => {
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile); // todo may be rotation
    nodeProcess = spawn(`./stegosd`, args, {
      cwd: nodePath
    });
    nodeProcess.stdout.on('data', data => {
      const str = data.toString('utf8');
      if (process.env.NODE_ENV === 'development') console.log(str);
      if (str.includes('ERROR [stegos')) {
        fs.appendFile(logFile, str, () => {});
        reject(new Error(`An error occurred\n${str}`));
      }
      if (str.includes('[stegos_api] Starting API Server on')) {
        resolve();
      }
    });
    nodeProcess.stderr.on('data', data => {
      const err = data.toString('utf8');
      fs.appendFile(logFile, err, () => {});
      reject(err);
    });
  });
}

function killNode() {
  if (nodeProcess != null) {
    nodeProcess.kill('SIGKILL');
    nodeProcess = null;
  }
}

/**
 * returns a token file path if exists
 * @return {Promise<null|Network>}
 */
function checkWSConnect(): Promise<Network | null> {
  return new Promise(resolve => {
    let ws = new WebSocket(`ws://${apiEndpoint}`);
    ws.onopen = () => {
      const network = 'testnet'; // todo when API will be ready
      resolve(network);
      closeWS();
    };
    ws.onclose = onCloseOrError;
    ws.onerror = onCloseOrError;

    function onCloseOrError() {
      if (ws) {
        closeWS();
        resolve();
      }
    }

    function closeWS() {
      if (ws) {
        ws.close();
        ws = null;
      }
    }
  });
}

function captureToken(): void {
  let token;
  let checkingInterval;
  checkingInterval = setInterval(() => {
    token = readFile(tokenFilePath);
    if (token) {
      clearInterval(checkingInterval);
      checkingInterval = null;
      mainWindow.webContents.send(TOKEN_RECEIVED, token);
    }
  }, 300);
}

function readFile(filePath: string): string | null {
  return fs.existsSync(filePath)
    ? fs.readFileSync(filePath).toString('utf8')
    : null;
}
