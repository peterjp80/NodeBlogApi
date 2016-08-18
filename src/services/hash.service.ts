import * as passwordHash from 'password-hash';

export class HashService {
  isHashed(value: string): boolean {
    if (!value) return false;
    return passwordHash.isHashed(value);
  }

  getHashedValue(value: string): string {
    if (value && !this.isHashed(value)) {
      return passwordHash.generate(value);
    }

    return value;
  }

  verify(value1: string, value2: string): boolean {
    if (!value1 && !value2) return true; // both values null or undefined
    if (!value1 || !value2) return false; // one value null or undefined
    // both values are hashed or both values are unhashed
    if ((passwordHash.isHashed(value1) && passwordHash.isHashed(value2)) || 
        (!passwordHash.isHashed(value1) && !passwordHash.isHashed(value2))) 
    {
      return value1 === value2;
    }     

    // Only value2 is hashed
    if (!passwordHash.isHashed(value1) && passwordHash.isHashed(value2))
      return passwordHash.verify(value1, value2);
    
    // Only value1 is hashed
    return passwordHash.verify(value2, value1);
  }
}