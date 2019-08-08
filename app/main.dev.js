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
import { app, BrowserWindow, dialog, ipcMain } from 'electron';
import { autoUpdater } from 'electron-updater';
import log from 'electron-log';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';
import getPath from 'platform-folders';
// import MenuBuilder from './menu';
import { TOKEN_RECEIVED } from './actions/node';
import { wsEndpoint } from './constants/config';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

app.commandLine.appendSwitch('high-dpi-support', 'true');

let mainWindow = null;
let nodeProcess = null;
let isTokenCapturing = false;
const nodePath =
  process.env.NODE_ENV === 'production'
    ? path.resolve(__dirname, '../../node/')
    : path.resolve(__dirname, '../node/');
const appDataPath = `${getPath('appData')}/stegos/`;
const tokenFile = `${appDataPath}/api.token`; // todo config
const logFile = `${appDataPath}/stegos.log`; // todo config

if (process.env.NODE_ENV === 'production') {
  const sourceMapSupport = require('source-map-support');
  sourceMapSupport.install();
}

if (
  process.env.NODE_ENV === 'development' ||
  process.env.DEBUG_PROD === 'true'
) {
  require('electron-debug')();
}

const installExtensions = async () => {
  const installer = require('electron-devtools-installer');
  const forceDownload = !!process.env.UPGRADE_EXTENSIONS;
  const extensions = ['REACT_DEVELOPER_TOOLS', 'REDUX_DEVTOOLS'];

  return Promise.all(
    extensions.map(name => installer.default(installer[name], forceDownload))
  ).catch(console.log);
};

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
  if (
    process.env.NODE_ENV === 'development' ||
    process.env.DEBUG_PROD === 'true'
  ) {
    await installExtensions();
  }

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

  // Disable default electron menu bar
  // const menuBuilder = new MenuBuilder(mainWindow);
  // menuBuilder.buildMenu();

  // No menu bar specified in design, remove unused menu builder file app/menu.js?
  mainWindow.setMenu(null);

  // Remove this if your app does not use auto updates
  // eslint-disable-next-line
  new AppUpdater();
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

ipcMain.on('RUN_NODE', event => {
  runNodeProcess()
    .then(() => event.sender.send('NODE_RUNNING'))
    .catch(e => {
      console.log(e);
      dialog.showErrorBox('Error', `An error occurred\n${e}`);
      event.sender.send('RUN_NODE_FAILED');
    });
});

function runNodeProcess(): Promise<void> {
  return new Promise((resolve, reject) => {
    try {
      if (fs.existsSync(tokenFile)) fs.unlinkSync(tokenFile);
      if (fs.existsSync(logFile)) fs.unlinkSync(logFile); // todo may be rotation
      nodeProcess = spawn(
        `./stegosd`,
        [
          '--chain',
          'devnet',
          '--data-dir',
          appDataPath,
          '--api-endpoint',
          wsEndpoint
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
        if (!isTokenCapturing) {
          isTokenCapturing = true;
          captureToken(resolve); // todo rid off NODE_RUNNING action
        }
      });
      nodeProcess.stderr.on('data', data => {
        reject(data.toString('utf8'));
      });
    } catch (e) {
      reject(e);
    }
  });
}

function captureToken(resolve): void {
  let token;
  let checkingInterval;
  checkingInterval = setInterval(() => {
    token = readFile(tokenFile);
    if (token) {
      clearInterval(checkingInterval);
      checkingInterval = null;
      resolve();
      mainWindow.webContents.send(TOKEN_RECEIVED, token);
    }
  }, 300);
}

function readFile(filePath: string): string | null {
  return fs.existsSync(filePath)
    ? fs.readFileSync(filePath).toString('utf8')
    : null;
}
