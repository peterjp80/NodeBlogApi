import "reflect-metadata";

import { Post } from './post';
import { posts } from './mock-posts';
import { IPostRepository } from './post.repository';

class MockPostRepository implements IPostRepository {
  getAll(): Promise<Post[]> {
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

export { MockPostRepository };