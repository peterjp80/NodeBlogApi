import * as express from 'express';
import * as bodyParser from 'body-parser';
import { Config } from './config';
import * as router from './router/'
const app = express();
const config = new Config();

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

const port: number = config.Port;

app.use('/api', router);
app.listen(port);