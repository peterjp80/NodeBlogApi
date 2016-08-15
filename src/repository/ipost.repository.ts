import { Post } from '../';

export interface IPostRepository {
  getAll(): Promise<Post[]>;
  get(id: string): Promise<Post>;
  create(post: Post): Promise<Post>;
  update(post: Post): void;
  delete(id: string): void;
}

