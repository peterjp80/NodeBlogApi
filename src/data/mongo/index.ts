import { Config } from '../../';
import * as mongoose from 'mongoose'

export class Database {
    constructor(private config: Config) {

    }

    connect(): Promise<any> {
      return mongoose.connect(this.config.ConnectionString).Promise;
    }

    
}