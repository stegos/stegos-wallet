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
import MenuBuilder from './menu';

export default class AppUpdater {
  constructor() {
    log.transports.file.level = 'info';
    autoUpdater.logger = log;
    autoUpdater.checkForUpdatesAndNotify();
  }
}

let mainWindow = null;
let nodeProcess = null;

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

// todo refactor
function runNodeProcess(pass: string): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const nodePath = path.resolve(__dirname, '../node/');
      const passFile = `${nodePath}/pass`; // todo config
      fs.writeFileSync(passFile, pass || '');
      let token;
      const tokenFile = `${nodePath}/api_token.txt`; // todo config
      nodeProcess = spawn(
        `./stegosd`,
        [],
        { cwd: nodePath, stdio: ['inherit', 'pipe', 'pipe'] },
        err => {
          if (err) {
            if (fs.existsSync(passFile)) fs.unlinkSync(passFile);
            if (fs.existsSync(tokenFile)) fs.unlinkSync(tokenFile);
            reject(err);
          }
        }
      );
      nodeProcess.stdout.on('data', data => {
        const str = data.toString('utf8');
        if (str.includes('Listening on')) {
          const ifTokenExists = fs.existsSync(tokenFile);
          if (ifTokenExists) {
            const readSync = fs.readFileSync(tokenFile);
            token = readSync.toString('utf8');
          }
          if (fs.existsSync(passFile)) fs.unlinkSync(passFile);
          if (fs.existsSync(tokenFile)) fs.unlinkSync(tokenFile);
          resolve(token);
        }
        if (str.includes('Invalid password:')) {
          if (fs.existsSync(passFile)) fs.unlinkSync(passFile);
          if (fs.existsSync(tokenFile)) fs.unlinkSync(tokenFile);
          reject(new Error('Invalid password'));
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
    height: 877
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

ipcMain.on('RUN_NODE', (event, pass) => {
  runNodeProcess(pass)
    .then(token => {
      event.sender.send('NODE_RUNNING', token);
      return true;
    })
    .catch(e => {
      dialog.showErrorBox('Error', e.message);
      event.sender.send('RUN_NODE_FAILED');
    });
});
