import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { createExpressServer, useContainer, defaultMetadataArgsStorage } from "routing-controllers";

import { Config, Database, debug } from './';
import { Container } from './container';

require('dotenv').config();

console.log("DB_NAME=%s", process.env.DB_NAME); // DB_NAME=undefined

require('./container-config');
useContainer(Container, { fallback: true, fallbackOnErrors: false});

const app = createExpressServer({
  routePrefix: "/api",
  controllerDirs: [__dirname + "/post/*.controller.js"]
});

debug("Directory: %s", __dirname);

const config = new Config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port: number = config.Port;

var database = new Database(config);
database.connect().then(app.listen(port)).catch((err) => {
  debug(err);
  console.error(err);
})
