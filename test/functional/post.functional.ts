var request = require('supertest');
import * as express from 'express';
import { Server } from 'http';
import start from '../../src/app';
import { debug } from '../../src/';

describe('Post resource', () => {
  let originalDBName: string;
  let originalNodeEnv: string;
  let app: express.Express;
  let server: Server;
  
  beforeAll((done) => {
    require('dotenv').config();

    debug("DB_NAME=%s", process.env.DB_NAME);

    originalDBName = process.env.DB_NAME;
    originalNodeEnv = process.env.NODE_ENV;

    process.env.DB_NAME = 'nbadbtest';
    process.env.NODE_ENV = 'functional';

    start((a: express.Express, s: Server) => {
      app = a;
      server = s;
    }).then(done);
  })

  afterAll(() => {
    process.env.DB_NAME = originalDBName;
    process.env.NODE_ENV = originalNodeEnv;
    server.close();
  })

  it('can get all posts', (done) => {
    request(app)
      .get('/api/post')
      .expect(200)
      .expect((res: any) => {
        var results = res.body;
        if (results.length != 0)
          throw "Expected results to have a length of 0";
      })
      .end((err: any, res: any) => { 
        if (err) done.fail(err)
        else done();
      })
  })
}) 