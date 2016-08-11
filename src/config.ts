export class Config {
  private _connectionString: string;
  private _databaseName: string;
  private _databaseAuthKey: string;
  private _port: number;

  get ConnectionString(): string {
    if (!this._connectionString)
      this._connectionString = process.env.CONNECTION_STRING || '';
    
    return this._connectionString;
  }

  get DatabaseName(): string {
    if (!this._databaseName)
      this._databaseName = process.env.DB_NAME || 'TestDb';

    return this._databaseName;
  }

  get DatabaseAuthKey(): string {
    if (!this._databaseAuthKey)
      this._databaseAuthKey = process.env.DB_AUTH_KEY || '';

    return this._databaseAuthKey;
  }

  get Port(): number {
    if (!this._port)
      this._port = process.env.PORT || 8080;
    
    return this._port;
  }
}
