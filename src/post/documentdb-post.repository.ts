import { Config, IPostRepository, Post, debug } from '../';
import { DocumentClient, RetrievedDocument, SqlQuerySpec } from 'documentdb'

export class PostRepository implements IPostRepository {
  constructor(private client: DocumentClient, private config: Config) {

  }

  private collectionUrl = 'dbs/' + this.config.DatabaseName + '/colls/Posts';

  getAll(): Promise<Post[]> {
    return new Promise<Post[]>((resolve, reject) => {
      this.client.queryDocuments(this.collectionUrl, 
        'SELECT * FROM root r WHERE r.publishedOn IS NOT NULL').toArray((err, results) => {
          if (err) reject(err)
          else {
            let posts: Post[];
            debug('getAll Posts results:')
            for (var queryResult of results) {
              debug(JSON.stringify(queryResult));
            }
            resolve(posts);
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
      this.client.queryDocuments(this.collectionUrl, querySpec).toArray((err, results) => {
        if (err) reject(err);
        else {
          debug(JSON.stringify(results));
          let post: Post;
          resolve(post);
        }
      })
    })
  };

  create(post: Post): Promise<Post> {
    let date: Date = new Date(Date.now());
    post.createdOn = date;
    post.updatedOn = date;

    return new Promise<Post>((resolve, reject) => {
      this.client.createDocument(this.collectionUrl, post, (err, doc) => {
        if (err) reject(err);
        else {
          debug(JSON.stringify(doc));
          let post: Post;
          resolve(post); 
        }
      });
    });
  };

  update(post: Post): Promise<any> {
    let date: Date = new Date(Date.now());
    post.updatedOn = date;
    let documentUrl = 'TODO';
    return new Promise<any>((resolve, reject) => {
      this.client.replaceDocument(documentUrl, post, (err, doc) => {
        if (err) reject(err);
        debug(JSON.stringify(doc));
        resolve();
      });
    });
  }

  delete(id: string): Promise<any> {
    let documentUrl = 'TODO';
    return new Promise<any>((resolve, reject) => {
      this.client.deleteDocument(documentUrl, (err) => {
        if (err) reject(err);
        resolve();
      })
    })
  }
}

