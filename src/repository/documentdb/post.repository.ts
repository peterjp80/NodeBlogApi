import { Config, Database, BaseRepository, IPostRepository, Post, debug } from '../../';

import { DocumentClient, RetrievedDocument, SqlQuerySpec } from 'documentdb'

export class PostRepository extends BaseRepository implements IPostRepository {
  constructor(client?: DocumentClient, config?: Config) {
    super("Posts");
  }

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
    return super.getItem<Post>(id).then((results) => {
      debug("get Post with id %s", id);
      debug(JSON.stringify(results));
      if (results) return Post.create(results);
      else return null;
    });
  };

  create(post: Post): Promise<Post> {
    return super.createItem<Post>(post).then((doc) => {
      debug("created Post with id %s", post.id);
      return Post.create(doc); 
    });
    // let date: Date = new Date(Date.now());
    // post.createdOn = date;
    // post.updatedOn = date;

    // return new Promise<Post>((resolve, reject) => {
    //   this.client.createDocument<Post>(this.collectionUrl, post, (err, doc) => {
    //     if (err) reject(err);
    //     else {
    //       try {
    //         debug("created Post with id %s", post.id);
    //         resolve(Post.create(doc)); 
    //       } catch (error) {
    //         reject(error);
    //       }
          
    //     }
    //   });
    // });
  };

  update(post: Post): Promise<any> {
    return super.updateItem(post);
  }

  delete(id: string): Promise<any> {
    return super.deleteItem(id);
  }
}

