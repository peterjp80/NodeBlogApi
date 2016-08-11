import { Config } from '../../';
import * as mongoose from 'mongoose'

export class Database {
    constructor(private config: Config) {

    }

    connect() {
      mongoose.connect(this.config.ConnectionString);
    }

    
}