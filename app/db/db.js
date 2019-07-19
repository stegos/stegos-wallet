import { remote } from 'electron';
import DataStore from 'nedb';
import fs from 'fs';
import crypto from 'crypto';

const DB_PATH = `${
  remote.process.env.NODE_ENV === 'development'
    ? __dirname
    : remote.app.getAppPath('userData')
}/stegos.db`;
const NO_PASSWORD = 'EMPTY_PASSWORD';
const algorithm = 'aes256';

let dbInstance; // cached
let password = NO_PASSWORD;

export const isDbExist = () => fs.existsSync(DB_PATH);

export const getDatabase = async pass => {
  if (!dbInstance) dbInstance = await createDatabase(pass);
  return dbInstance;
};

const createDatabase = async pass =>
  new Promise((resolve, reject) => {
    console.log('DB_PATH', DB_PATH);
    const exist = isDbExist();
    password = pass;
    const db = new DataStore({
      filename: DB_PATH,
      afterSerialization: encrypt,
      beforeDeserialization: decrypt
    });
    db.loadDatabase(err => {
      if (err) {
        console.log('Error while loading database', err);
        reject(
          new Error('The account password is incorrect. Please try again.')
        );
      } else resolve(db);
    });
    if (!exist) {
      db.insert({ name: 'password', value: pass });
    }
  });

const isJson = item => {
  item = typeof item !== 'string' ? JSON.stringify(item) : item;

  try {
    item = JSON.parse(item);
  } catch (e) {
    return false;
  }

  return typeof item === 'object' && item !== null;
};

const encrypt = doc => {
  if (isJson(doc)) {
    const cipher = crypto.createCipher(algorithm, password);
    const encrypted =
      cipher.update(JSON.stringify(doc), 'utf8', 'hex') + cipher.final('hex');
    console.log(`Ser ${encrypted}`);
    return encrypted;
  }
  return doc;
};

const decrypt = doc => {
  const decipher = crypto.createDecipher(algorithm, password);
  try {
    const decrypted =
      decipher.update(doc, 'hex', 'utf8') + decipher.final('utf8');
    return JSON.parse(decrypted);
  } catch (e) {
    return doc;
  }
};
