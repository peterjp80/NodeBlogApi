import { Database } from './database';

describe("documentdb Database", () => {
  it('buildDatabaseUrl returns dbs/testdb when db name is testdb', () => {
    expect(Database.buildDatabaseUrl('testdb')).toBe('dbs/testdb');
  })
})