import getPath from 'platform-folders';
import DataStore from 'nedb';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import type { Network } from '../reducers/types';

const DIR_PATH = path.resolve(`${getPath('appData')}/stegos`);
const V10_DB_PATH = path.resolve(`${getPath('appData')}/stegos/stegos.db`);
const DB_NAME = 'stegos.db';
const NO_PASSWORD = 'EMPTY_PASSWORD';
const algorithm = 'aes256';

let dbInstance; // cached

export const isDbExist = (chain: Network) =>
  isV10DbExist() || fs.existsSync(getChainDBPath(chain));

const isV10DbExist = () => fs.existsSync(V10_DB_PATH);

export const getDb = () =>
  new Promise((resolve, reject) => {
    if (!dbInstance) reject(new Error('DB not initialized'));
    else resolve(dbInstance);
  });

export const initializeDb = async (chain: Network, pass: string) => {
  if (isV10DbExist()) await migrateFromV10(pass);
  if (!chain) return null;
  dbInstance = new DataStore({
    filename: getChainDBPath(chain),
    autoload: true
  });
  return dbInstance;
};

const migrateFromV10 = async (pass: string) => {
  const v10Db = await loadV10Database(pass);
  const chains: Network[] = ['mainnet', 'testnet'];
  await Promise.all(
    chains.map(async c => {
      const db = createChainDbIfNecessary(c);
      if (db) await copyDb(v10Db, db);
    })
  );
  fs.unlinkSync(V10_DB_PATH);
};

const loadV10Database = async pass =>
  new Promise((resolve, reject) => {
    const isPassword = pass != null && pass.length > 0;
    const password = isPassword ? pass : NO_PASSWORD;
    const db = new DataStore({
      filename: V10_DB_PATH,
      afterSerialization: encrypt(password),
      beforeDeserialization: decrypt(password)
    });
    db.loadDatabase(err => {
      if (err) {
        console.log('Error while loading database', err);
        reject(new Error('alert.account.password.is.incorrect'));
      } else {
        resolve(db);
      }
    });
  });

const copyDb = async (mainDb: DataStore, targetDb: DataStore) =>
  new Promise(resolve => {
    mainDb.find({}, (err, all) => {
      targetDb.insert(all, () => {
        resolve();
      });
    });
  });

const createChainDbIfNecessary = (chain: Network) =>
  fs.existsSync(getChainNodePath(chain)) &&
  !fs.existsSync(getChainDBPath(chain))
    ? createChainDb(chain)
    : null;

const createChainDb = (chain: Network) =>
  chain
    ? new DataStore({
        // filename: `${DIR_PATH}/${chain}/testDb.db`,
        filename: getChainDBPath(chain),
        autoload: true
      })
    : null;

const isJson = item => {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  return typeof item === 'object' && item !== null;
};

const encrypt = pass => doc => {
  if (isJson(doc)) {
    const cipher = crypto.createCipher(algorithm, pass);
    return (
      cipher.update(JSON.stringify(doc), 'utf8', 'hex') + cipher.final('hex')
    );
  }
  return doc;
};

const decrypt = pass => doc => {
  const decipher = crypto.createDecipher(algorithm, pass);
  try {
    const decrypted =
      decipher.update(doc, 'hex', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    return doc;
  }
};

const getChainDBPath = (chain: string) => `${DIR_PATH}/${chain}/${DB_NAME}`;
const getChainNodePath = (chain: string) => `${DIR_PATH}/${chain}`;
