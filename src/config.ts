export interface IConfig {
  ConnectionString: string;
  Port: number;
}

export class Config implements IConfig {
  private _connectionString: string;
  private _port: number;

  get ConnectionString(): string {
    if (!this._connectionString)
      this._connectionString = process.env.CONNECTION_STRING || '';
    
    return this._connectionString;
  }

  get Port(): number {
    if (!this._port)
      this._port = process.env.PORT || 8080;
    
    return this._port;
  }
}
