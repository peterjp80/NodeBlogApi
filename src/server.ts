import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { createExpressServer, useContainer, defaultMetadataArgsStorage } from "routing-controllers";

import { Config, Database, debug } from './';
import { Container } from './container';

require('dotenv').config();

console.log("DB_NAME=%s", process.env.DB_NAME);

const config = new Config();

let databaseReady = false;
let database = new Database(config);
database.connect().then(() => { 
  databaseReady = true;
  //require('./container-config');
  //useContainer(Container, { fallback: true, fallbackOnErrors: false});

  debug("Creating express server");

  const app = createExpressServer({
    routePrefix: "/api",
    controllerDirs: [__dirname + "/post/*.controller.js"]
  });

  debug("Directory: %s", __dirname);

  app.use(bodyParser.urlencoded({extended: true}));
  app.use(bodyParser.json());
  const port: number = config.Port;

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