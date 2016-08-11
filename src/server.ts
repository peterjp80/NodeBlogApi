import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { createExpressServer, useContainer, defaultMetadataArgsStorage } from "routing-controllers";

import { Config, debug } from './';
import { Container } from './container';

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

app.listen(port);