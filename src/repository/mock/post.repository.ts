import "reflect-metadata";

import { Post, IPostRepository, debug } from '../../';
import { posts } from './mock-posts';

class PostRepository implements IPostRepository {
  getAll(): Promise<Post[]> {
    debug("Mock PostRepository getAll()")
    return Promise.resolve(posts);
  }

  get(id: string): Promise<Post> {
    return Promise.resolve(posts.find(x => x.id == id));
  }

  create(post: Post): Promise<Post> {
    return Promise.resolve(post);
  }

  update(post: Post): void {
    return;
  }

  delete(id: string): void {
    return;
  }
}

export { PostRepository };