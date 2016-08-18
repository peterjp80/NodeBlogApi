import { User } from '../';

export interface IUserRepository {
  get(id: string): Promise<User>;
  create(user: User): Promise<User>;
  update(user: User): Promise<any>;
  delete(id: string): Promise<any>;
}