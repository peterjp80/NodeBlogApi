import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { createExpressServer, useContainer, defaultMetadataArgsStorage } from "routing-controllers";

import { Config, Database, debug } from './';

if (process.env.ENV_PATH) require('dotenv').config({path: process.env.ENV_PATH});
else require('dotenv').config();

debug("DB_NAME=%s", process.env.DB_NAME);

const config = new Config();

let databaseReady = false;
let database = new Database(config);

// Ensure that the we're "connected" and that the database and collections exist before listening for requests
database.connect().then(() => { 
  databaseReady = true;

  debug("Creating express server");

  const app = createExpressServer({
    routePrefix: "/api",
    controllerDirs: [__dirname + "/controllers/*.controller.js"]
  });

  debug("Directory: %s", __dirname);

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  const port: number = config.port;

  app.listen(port);
  debug("Listening on port %i", port);

  }).catch((err) => {
    debug(err);
    console.error(err);
  })

function wait () {
   if (!databaseReady) setTimeout(wait, 1000);
}

wait();