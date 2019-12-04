import getPath from 'platform-folders';
import DataStore from 'nedb';
import fs from 'fs';
import path from 'path';
import type { Network } from '../reducers/types';

const DIR_PATH = path.resolve(`${getPath('appData')}/stegos`);
const DB_NAME = 'stegos.db';

let dbInstance; // cached

export const isDbExist = (chain: Network) =>
  fs.existsSync(getChainDBPath(chain));

export const getDb = () =>
  new Promise((resolve, reject) => {
    if (!dbInstance) reject(new Error('DB not initialized'));
    else resolve(dbInstance);
  });

export const initializeDb = (chain: Network) => {
  if (!chain) return null;
  dbInstance = new DataStore({
    filename: getChainDBPath(chain),
    autoload: true
  });
  return dbInstance;
};

const getChainDBPath = (chain: string) => `${DIR_PATH}/${chain}/${DB_NAME}`;
