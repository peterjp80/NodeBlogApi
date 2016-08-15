import start from './app'
import { debug } from './';

let databaseReady = false;

if (process.env.ENV_PATH) require('dotenv').config({path: process.env.ENV_PATH});
else require('dotenv').config();

debug("DB_NAME=%s", process.env.DB_NAME);

start().then(() => databaseReady = true);

function wait () {
   if (!databaseReady) setTimeout(wait, 1000);
}

wait();