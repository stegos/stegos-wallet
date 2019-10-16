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
// import MenuBuilder from './menu';
import { TOKEN_RECEIVED } from './actions/node';
import { wsEndpoint } from './constants/config';
import parseArgs from './utils/argv';
import { checkUpdateAndNotify } from './utils/updater';

const WebSocket = require('ws');

app.commandLine.appendSwitch('high-dpi-support', 'true');

let mainWindow = null;
let nodeProcess = null;

if (process.env.NODE_ENV === 'production') parseArgs();

const nodePath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../node/')
    : path.resolve(__dirname, '../node/');
const stegosDataPath =
  process.env.APPDATAPATH || `${getPath('appData')}/stegos`;
const apiEndpoint = process.env.APIENDPOINT || wsEndpoint;

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

  if (process.env.NODE_ENV === 'development' || process.env.DEBUG === 'true') {
    require('electron-debug')();
    mainWindow.webContents.on('did-frame-finish-load', () => {
      mainWindow.webContents.openDevTools();
    });
  }

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

  // Disable default electron menu bar
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  mainWindow.setMenu(null);

  checkUpdateAndNotify();
});

app.on('quit', () => {
  if (nodeProcess != null) {
    nodeProcess.kill('SIGKILL');
    nodeProcess = null;
  }
  app.exit(0);
});

/**
 * IPC listeners
 */

ipcMain.on('CHECK_RUNNING_NODE', async event => {
  try {
    const nodeStarted = await checkWSConnect();
    event.sender.send('CHECK_RUNNING_NODE_RESULT', {
      isRunning: nodeStarted,
      envChain: process.env.STEGOS_CHAIN
    });
  } catch (e) {
    console.log(e);
    event.sender.send('CHECK_RUNNING_NODE_RESULT', false);
  }
});

ipcMain.on('RUN_NODE', async (event, args) => {
  try {
    const nodeStarted = await checkWSConnect();
    if (!nodeStarted) await runNodeProcess(args.chain);
    const tokenFile = `${stegosDataPath}/${args.chain}/api.token`; // todo config
    captureToken(tokenFile);
  } catch (e) {
    console.log(e);
    event.sender.send('RUN_NODE_FAILED', { error: e });
  }
});

ipcMain.on('CONNECT_TO_NODE', async event => {
  try {
    const tokenFile = `${stegosDataPath}/testnet/api.token`; // fix when API will be ready
    captureToken(tokenFile);
  } catch (e) {
    console.log(e);
    event.sender.send('RUN_NODE_FAILED', { error: e });
  }
});

function runNodeProcess(chain: string): Promise<void> {
  const appDataPath = `${stegosDataPath}/${chain}`;
  const logFile = `${appDataPath}/stegos.log`; // todo config
  return new Promise((resolve, reject) => {
    if (fs.existsSync(logFile)) fs.unlinkSync(logFile); // todo may be rotation
    nodeProcess = spawn(
      `./stegosd`,
      [
        '--chain',
        chain,
        '--data-dir',
        appDataPath,
        '--api-endpoint',
        apiEndpoint
      ],
      {
        cwd: nodePath
      }
    );
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

function checkWSConnect(): Promise<boolean> {
  return new Promise(resolve => {
    let ws = new WebSocket(`ws://${apiEndpoint}`);
    ws.onopen = () => {
      resolve(true);
      closeWS();
    };
    ws.onclose = onCloseOrError;
    ws.onerror = onCloseOrError;

    function onCloseOrError() {
      if (ws) {
        closeWS();
        resolve(false);
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

function captureToken(filepath: string): void {
  let token;
  let checkingInterval;
  checkingInterval = setInterval(() => {
    token = readFile(filepath);
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
