import { Config } from '../../';
import * as mongoose from 'mongoose'

export class Database {
    constructor(private config: Config) {
      if (!Config.isTestEnvironment()) {
        config = new Config();
      }
    }

    connect(): Promise<any> {
      return mongoose.connect(this.config.connectionString).Promise;
    }

    
}