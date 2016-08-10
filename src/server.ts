import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { createExpressServer, useContainer, defaultMetadataArgsStorage } from "routing-controllers";

import { Config, PostRepository, PostController } from './';
import { Container } from './container';

Container.set(PostRepository, new PostRepository());
Container.set(PostController, new PostController(Container.get(PostRepository)));
useContainer(Container, { fallback: true, fallbackOnErrors: false});

const app = createExpressServer({
  routePrefix: "/api",
  controllerDirs: [__dirname + "/post/*.controller.js"]
});

console.log("Directory:");
console.log(__dirname);

const config = new Config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port: number = config.Port;

app.listen(port);