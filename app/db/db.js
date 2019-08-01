import getPath from 'platform-folders';
import DataStore from 'nedb';
import fs from 'fs';
import crypto from 'crypto';
import path from 'path';

const DIR_PATH = path.resolve(`${getPath('appData')}/stegos/`);
const DB_PATH = `${DIR_PATH}/stegos.db`;
const TMP_DB_PATH = `${DIR_PATH}/stegos_tmp.db`;
const NO_PASSWORD = 'EMPTY_PASSWORD';
const algorithm = 'aes256';

let dbInstance; // cached

export const isDbExist = () => fs.existsSync(DB_PATH);

export const getDatabase = () =>
  new Promise((resolve, reject) => {
    if (!dbInstance) reject(new Error('DB not initialized'));
    else resolve(dbInstance);
  });

export const createDatabase = async pass =>
  new Promise((resolve, reject) => {
    const isPassword = pass != null && pass.length > 0;
    const password = isPassword ? pass : NO_PASSWORD;
    const db = new DataStore({
      filename: DB_PATH,
      afterSerialization: encrypt(password),
      beforeDeserialization: decrypt(password)
    });
    db.loadDatabase(err => {
      if (err) {
        console.log('Error while loading database', err);
        reject(
          new Error('The account password is incorrect. Please try again.')
        );
      } else {
        db.update(
          { setting: 'isPasswordSet' },
          { setting: 'isPasswordSet', value: isPassword },
          { upsert: true }
        );
        dbInstance = db;
        resolve(db);
      }
    });
  });

export const setNewPassword = async (
  newPass: string,
  changePassOnNode: () => {}
) =>
  new Promise((resolve, reject) => {
    dbInstance.find({}, (err, docs) => {
      if (err) {
        reject(err);
        return;
      }
      let tmpDb = new DataStore({
        filename: TMP_DB_PATH,
        afterSerialization: encrypt(newPass),
        beforeDeserialization: decrypt(newPass)
      });
      tmpDb.loadDatabase(async error => {
        if (error) {
          console.log('Error while loading database', error);
          reject(error);
        }
        tmpDb.insert(docs);
        try {
          await changePassOnNode();
          dbInstance = null;
          tmpDb = null;
          fs.unlinkSync(DB_PATH);
          fs.copyFileSync(TMP_DB_PATH, DB_PATH);
          fs.unlinkSync(TMP_DB_PATH);
          resolve(await createDatabase(newPass));
        } catch (e) {
          reject(e);
        }
      });
    });
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
