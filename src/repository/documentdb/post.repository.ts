import { Config, Database, IPostRepository, Post, debug } from '../../';

import { DocumentClient, RetrievedDocument, SqlQuerySpec } from 'documentdb'

export class PostRepository implements IPostRepository {
  constructor(private client?: DocumentClient, private config?: Config) {
    if (!Config.isTestEnvironment()) {
      if (!client) this.client = Database.client;
      if (!config) this.config = new Config();
    }    
    debug(this.config);
    this.collectionUrl = 'dbs/' + this.config.databaseName + '/colls/Posts';
  }

  private collectionUrl: string;

  getAll(): Promise<Post[]> {
    return new Promise<Post[]>((resolve, reject) => {
      this.client.queryDocuments(this.collectionUrl, 
        'SELECT * FROM root r WHERE IS_DEFINED(r.publishedOn) AND NOT IS_NULL(r.publishedOn)').toArray((err, results) => {
          if (err) reject(err)
          else {
            try {
              let posts = new Array<Post>();
              debug('getAll Posts results:')
              for (var queryResult of results) {
                posts.push(Post.create(queryResult))
              }
              resolve(posts);
            } catch (error) {
              reject(error)
            }            
          }
        })
    });
  }

  get(id: string): Promise<Post> {
    let querySpec = <SqlQuerySpec>{
      query: 'SELECT * FROM root r WHERE r.id = @id',
      parameters: [{
        name: '@id',
        value: id
      }]
    };

    return new Promise<Post>((resolve, reject) => {
      this.client.queryDocuments<Post>(this.collectionUrl, querySpec).toArray((err, results) => {
        if (err) reject(err);
        else {
          try {
            debug("get Post with id %s", id);
            debug(JSON.stringify(results));
            if (results && results.length > 0)
              resolve(Post.create(results[0]));
            else
              resolve(null);
          } catch (error) {
              reject(error)
          }
          
        }
      })
    })
  };

  create(post: Post): Promise<Post> {
    let date: Date = new Date(Date.now());
    post.createdOn = date;
    post.updatedOn = date;

    return new Promise<Post>((resolve, reject) => {
      this.client.createDocument<Post>(this.collectionUrl, post, (err, doc) => {
        if (err) reject(err);
        else {
          try {
            debug("created Post with id %s", post.id);
            resolve(Post.create(doc)); 
          } catch (error) {
            reject(error);
          }
          
        }
      });
    });
  };

  update(post: Post): Promise<any> {
    let date: Date = new Date(Date.now());
    let documentUrl = this.collectionUrl + '/docs/' + post.id;
    debug("documentUrl: %s", documentUrl);
    post.updatedOn = date;
    return new Promise<any>((resolve, reject) => {
    this.client.replaceDocument(documentUrl, post, (err, doc) => {
      if (err) reject(err);
      resolve();
      
    });
    
      
    });
  }

  delete(id: string): Promise<any> {
    let documentUrl = this.collectionUrl + '/docs/' + id;
    debug("documentUrl: %s", documentUrl);
    return new Promise<any>((resolve, reject) => {
      this.client.deleteDocument(documentUrl, (err) => {
        if (err) reject(err);
        resolve();
      })
    })
  }
}

