import * as passwordHash from 'password-hash';

export class User {
  id: string;
  password: string;
  createdOn: Date;
  disabled: boolean;

  static create(obj: any) {
      var user = new User();

      if (!obj) return user;
      if (obj.id) user.id = obj.id;
      if (obj.password) user.password = obj.password;
      if (obj.createdOn) user.createdOn = obj.createdOn;
      if (obj.disabled) user.disabled = true;

      return user;
  }
}