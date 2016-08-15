import * as express from 'express';
import * as bodyParser from 'body-parser';
import "reflect-metadata";
import { createExpressServer, useContainer, defaultMetadataArgsStorage } from "routing-controllers";

import { Config, Database, debug } from './';

export default function start(callback?: any): Promise<any> { 

  const config = new Config();
  
  let database = new Database(config);

  // Ensure that the we're "connected" and that the database and collections exist before listening for requests
  return database.connect().then(() => { 
    debug("Creating express server");

    const app = createExpressServer({
      routePrefix: "/api",
      controllerDirs: [__dirname + "/controllers/*.controller.js"]
    });

    debug("Directory: %s", __dirname);

    app.use(bodyParser.urlencoded({extended: true}));
    app.use(bodyParser.json());
    const port: number = config.port;

    let server = app.listen(port);
    debug("Listening on port %i", port);

    if (callback) callback(app, server);

    return app;

    }).catch((err) => {
      debug(err);
      console.error(err);
    })
}