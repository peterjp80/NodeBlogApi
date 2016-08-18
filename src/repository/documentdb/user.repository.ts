import { Config, Database, IUserRepository, User, debug, BaseRepository } from '../../';

import { DocumentClient, RetrievedDocument, SqlQuerySpec } from 'documentdb'

export class UserRepository extends BaseRepository implements IUserRepository {
  constructor(client?: DocumentClient, config?: Config) {
    super("Users", client, config);
  }

  get(id: string): Promise<User> {
    return super.getItem<User>(id).then((results) => {
      debug("get User with id %s", id);
      debug(JSON.stringify(results));
      if (results) return User.create(results);
      else return null;
    });
  };

  create(user: User): Promise<User> {
    this.get(user.id).then((currentUser) => {

    })
    return super.createItem<User>(user).then((doc) => {
      debug("created user with id %s", user.id);
      return User.create(doc); 
    });
  };

  update(post: User): Promise<any> {
    return super.updateItem(post);
  }

  delete(id: string): Promise<any> {
    return super.deleteItem(id);
  }

}