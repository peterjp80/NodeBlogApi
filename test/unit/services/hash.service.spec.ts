import { HashService } from '../../../src/services/hash.service';
import * as passwordHash from 'password-hash';

describe("HashService", () => {
  let service: HashService;

  beforeEach(() => {
    service = new HashService();
  })

  it('isHashed() returns false when password is not hashed', () => {
    expect(service.isHashed('sha1test')).toBeFalsy();
  })

  it('isHashed() returns false when password is null or undefined', () => {
    expect(service.isHashed(undefined)).toBeFalsy();
    expect(service.isHashed(null)).toBeFalsy();
  })

  it('isHashed() returns true when password is hashed', () => {
    let hashedPassword = passwordHash.generate('myPa$$word');

    expect(service.isHashed(hashedPassword)).toBeTruthy();
  })

  it('getHashedValue() hashes the password', () => {
    let hashedPassword = service.getHashedValue('myPa$$word')

    expect(passwordHash.verify('wrongPa$$word', hashedPassword)).toBeFalsy();
    expect(passwordHash.verify('myPa$$word', hashedPassword)).toBeTruthy();
  })

  it('getHashedValue() does nothing when password is already hashed', () => {
    let hashedPassword = passwordHash.generate('myPa$$word');

    expect(service.getHashedValue(hashedPassword)).toBe(hashedPassword);
  })

  it('verify() returns true when the plain text password matches the hashed password', () => {
    let hashedPassword = passwordHash.generate('myPa$$word');

    expect(service.verify('myPa$$word', hashedPassword)).toBeTruthy();
    expect(service.verify(hashedPassword, 'myPa$$word')).toBeTruthy();
  })

  it('verify() returns false when the plain text password does not match the hashed password', () => {
    let hashedPassword = passwordHash.generate('myPa$$word');

    expect(service.verify('wrongPa$$word', hashedPassword)).toBeFalsy();
    expect(service.verify(hashedPassword, 'wrongPa$$word')).toBeFalsy();
  })

  it('verify() returns true when neither passwords are hashed and they match', () => {
    expect(service.verify('myPa$$word', 'myPa$$word')).toBeTruthy();
  })

  it('verify() returns false when neither passwords are hashed and they do not match', () => {
    expect(service.verify('myPa$$word', 'wrongPa$$word')).toBeFalsy();
  })

  it('verify() returns true when both passwords are hashed and they match', () => {
    let hashedPassword = passwordHash.generate('myPa$$word');
    let wrongHashedPassword = passwordHash.generate('wrongPa$$word');

    expect(service.verify(hashedPassword, hashedPassword)).toBeTruthy();
  })

  it('verify() returns false when both passwords are hashed and they do not match', () => {
    let hashedPassword = passwordHash.generate('myPa$$word');
    let wrongHashedPassword = passwordHash.generate('wrongPa$$word');

    expect(service.verify(hashedPassword, wrongHashedPassword)).toBeFalsy();
  })

  it('verify() returns true when both values are null or undefined', () => {
    expect(service.verify(null, null)).toBeTruthy();
    expect(service.verify(undefined, undefined)).toBeTruthy();
    expect(service.verify(undefined, null)).toBeTruthy();
    expect(service.verify(null, undefined)).toBeTruthy();
  })

  it('verify() returns false when only one value is null or undefined', () => {
    expect(service.verify(null, 'something')).toBeFalsy();
    expect(service.verify('something', null)).toBeFalsy();
    expect(service.verify(undefined, 'something')).toBeFalsy();
    expect(service.verify('something', undefined)).toBeFalsy();

    let hashedPassword = passwordHash.generate('myPa$$word');
    expect(service.verify(null, hashedPassword)).toBeFalsy();
    expect(service.verify(hashedPassword, null)).toBeFalsy();
    expect(service.verify(undefined, hashedPassword)).toBeFalsy();
    expect(service.verify(hashedPassword, undefined)).toBeFalsy();
  })
})