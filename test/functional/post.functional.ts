var request = require('supertest');
import * as express from 'express';
import { Server } from 'http';
import start from '../../src/app';
import { debug, Database, Post } from '../../src/';

describe('Post resource', () => {
  let originalDBName: string;
  let originalNodeEnv: string;
  let dbName = 'nbadbtest';
  let app: express.Express;
  let server: Server;
  
  beforeAll((done) => {
    require('dotenv').config();

    debug("DB_NAME=%s", process.env.DB_NAME);

    originalDBName = process.env.DB_NAME;
    originalNodeEnv = process.env.NODE_ENV;

    process.env.DB_NAME = dbName;
    process.env.NODE_ENV = 'functional';

    start((a: express.Express, s: Server) => {
      app = a;
      server = s;
    }).then(done);
  })

  afterAll((done) => {
    process.env.DB_NAME = originalDBName;
    process.env.NODE_ENV = originalNodeEnv;
    deleteDatabase().then(() => {
      server.close();
      done();
    })
  })

  it('can add new posts', (done) => {
    let posts: Post[] = [<Post>{
      id: 'test-post-1',
      title: 'TestTitle',
      description: 'TestDescription',
      html: 'TestHTML',
      publishedOn: new Date(Date.now())
    }, <Post>{
      id: 'test-post-2',
      title: 'Published Title',
      description: 'Published Description',
      html: 'Published HTML',
      publishedOn: new Date(Date.now())
    }, <Post> {
      id: 'test-post-3',
      title: 'Unpublished Title',
      description: 'Unpublished Description',
      html: 'Unpublished HTML'
    }];

    createPost(0);

    function createPost(idx: number) {
      debug("idx: " + idx);
      let post = posts[idx];
      debug('Creating Post: %s', post.id);

      request(app)
      .post('/api/post')
      .send(post)
      .set('Accept', 'application/json')
      .expect(201)
      .expect((res: any) => {
        const err = "Unexpected result";
        var result = res.body;
        if (!result) throw err;

        if (!result.id.startsWith('test-post')) throw err;
        debug('Created ID: %s', result.id);
      })
      .end((err: any, res: any) => {
        if (err) done.fail(err);
        else {
          if (idx < posts.length - 1) {
            createPost(++idx);
          } else {
            done();
          }   
        }
      });
    }    
  })

  it('returns 409 error when creating a post with a duplicate id', (done) => {
    var post = <Post> {
      id: 'test-post-1',
      title: 'Some Title'
    };

    request(app)
      .post('/api/post')
      .send(post)
      .set('Accept', 'application/json')
      .expect(409)
      .end((err: any, res: any) => {
        if (err) done.fail(err);
        else done();
      })
  })

  it('can get all published posts', (done) => {
    request(app)
      .get('/api/post')
      .expect(200)
      .expect((res: any) => {
        var results = res.body;
        if (results.length != 2) done.fail("Expected results to have a length of 0");
        if (!(results.find((x: Post) => x.id === 'test-post-1')))
          done.fail('Could not find test-post-1');
        if (!(results.find((x: Post) => x.id === 'test-post-2')))
          done.fail('Could not find test-post-2');
        if ((results.find((x: Post) => x.id === 'test-post-3')))
          done.fail('Found unpublished test-post-3');
      })
      .end((err: any, res: any) => { 
        if (err) done.fail(err);
        else done();
      })
  })

  it('can get single post', (done) => {
    request(app)
      .get('/api/post/test-post-2')
      .expect(200)
      .expect((res: any) => {
        var post = <Post>res.body;
        if (!post) done.fail("Did not retrieve Post");
        if (post.id !== 'test-post-2') done.fail("Post ID was incorrect");
        if (post.title !== 'Published Title') done.fail("Post title was incorrect");
      })
      .end((err: any, res: any) => {
        if (err) done.fail(err);
        else done();
      })
  })

  it('returns 404 when getting a post with an id that does not exist', (done) => {
    request(app)
      .get('/api/post/invalid-id')
      .expect(404)
      .end((err: any, res: any) => {
        if (err) done.fail(err);
        else done();
      });
  })

  it('can update a post', (done) => {
    request(app)
      .put('/api/post/test-post-1')
      .send({title: 'Updated Title', publishedOn: new Date(Date.now())})
      .set('Accept', 'application/json')
      .expect(204)
      .end((err: any, res: any) => {
        if (err) done.fail(err)
        else {
          request(app)
            .get('/api/post/test-post-1')
            .expect(200)
            .expect((res: any) => {
              var post = <Post>res.body;
              if (post.title !== 'Updated Title') done.fail("Post title was not Updated Title");
            })
            .end((err: any, res: any) => {
              if (err) done.fail(err);
              else done();
            })
        }
      })
  })

  it('can delete a post', (done) => {
    request(app)
      .delete('/api/post/test-post-2')
      .expect(204)
      .end((err: any, res: any) => {
        if (err) done.fail(err);
        else {
          request(app)
            .get('/api/post/test-post-2')
            .expect(404)
            .end((err: any, res: any) => {
              if (err) done.fail(err);
              else done();
            })
        }
      })
  })

  function deleteDatabase() {
    debug("Deleting Database");
    return new Promise((resolve, reject) => {
        Database.client.deleteDatabase(Database.buildDatabaseUrl(dbName), (err) => {
            if (err) {
              debug(err);
              reject(err);
            }
            else {
              resolve();
              debug("Database Deleted");
            }
        });
    }); 
  }
}) 

