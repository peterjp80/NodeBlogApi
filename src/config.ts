export class Config {
  private _connectionString: string;
  private _databaseName: string;
  private _databaseAuthKey: string;
  private _collectionPerformanceLevel: string;
  private _port: number;

  static isTestEnvironment(): boolean {
    return process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test';
  }

  static isProdEnvironment(): boolean {
    return process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase().startsWith('prod')
  }

  get connectionString(): string {
    if (!this._connectionString)
      this._connectionString = process.env.CONNECTION_STRING || '';
    
    return this._connectionString;
  }

  get databaseName(): string {
    if (!this._databaseName)
      this._databaseName = process.env.DB_NAME || 'nbadbtest';

    return this._databaseName;
  }

  get databaseAuthKey(): string {
    if (!this._databaseAuthKey)
      this._databaseAuthKey = process.env.DB_AUTH_KEY || '';

    return this._databaseAuthKey;
  }

  get collectionPerformanceLevel(): string {
    if (!this._collectionPerformanceLevel)
      this._collectionPerformanceLevel = process.env.COLLECTION_PERF_LEVEL || 'S1';
    
    return this._collectionPerformanceLevel;
  }

  get port(): number {
    if (!this._port)
      this._port = process.env.PORT || 8080;
    
    return this._port;
  }
}
