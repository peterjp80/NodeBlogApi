import { Config, IPostRepository, Post, debug } from '../';
import { DocumentClient, RetrievedDocument } from 'documentdb'

export class PostRepository implements IPostRepository {
  constructor(private client: DocumentClient, private config: Config) {

  }

  private collectionUrl = 'dbs/' + this.config.DatabaseName + '/colls/Posts';

  getAll(): Promise<Post[]> {
    return new Promise<Post[]>((resolve, reject) => {
      this.client.queryDocuments(this.collectionUrl, 
        'SELECT * FROM root r WHERE r.visible = true').toArray((err, results) => {
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
}