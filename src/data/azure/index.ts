import { Config, debug } from '../../';
import { DocumentClient, SqlQuerySpec } from 'documentdb';

export class Database {
    constructor(private config: Config) {

    }

    private static collections = ['Posts'];
    public static client: DocumentClient;

    connect(): Promise<any> {
        let self = this;
        var databaseUrl = 'dbs/' + this.config.DatabaseName;

        debug("DatabaseUrl=%s", process.env.DB_NAME);
        debug("ConnectionString=%s", process.env.CONNECTION_STRING);
        debug("Key=%s", process.env.DB_AUTH_KEY);
        var c = new DocumentClient(this.config.ConnectionString, {masterKey: this.config.DatabaseAuthKey});
        return self.initializeDatabase(c).then((result) => { return self.initializeCollections(0, databaseUrl, c)}).then((result) => {
            debug("Database Connected");
            Database.client = c;
        });
    }

    private initializeDatabase(client: DocumentClient): Promise<any> {
        debug("Initializing Database");
        let querySpec = <SqlQuerySpec>{
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: this.config.DatabaseName
            }]
        };

        return new Promise((resolve, reject) => {
            client.queryDatabases(querySpec).toArray((err, results) => {
                if (err) {
                    debug(err);
                    console.error(err);
                    reject(err);
                } else {
                    if (results.length === 0) {
                        debug("Creating Database");
                        client.createDatabase({id: this.config.DatabaseName}, (err, created) => {
                            if (err) {
                                debug(err);
                                console.error(err);
                                reject(err);
                            } else {
                                debug("Database (%s) Created", this.config.DatabaseName)
                            } 
                        })
                    }
                    resolve();
                }            
            });
        })
        

        
    }

    private initializeCollections(collectionIndex: number, databaseUrl: string, client: DocumentClient): Promise<any> {
        let collectionId = Database.collections[collectionIndex];
        debug("Initializing Collection (%s)", collectionId);
        let querySpec = <SqlQuerySpec>{
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: collectionId
            }]
        };

        return new Promise<any> ((resolve, reject) => {
            client.queryCollections(databaseUrl, querySpec).toArray((err, results) => {
                if (err) {
                    debug(err);
                    console.error(err);
                    reject(err);
                } else {
                    if (results.length === 0) {
                        var requestOptions = {
                            offerType: this.config.CollectionPerformanceLevel
                        }

                        debug("Creating Collection (%s)", collectionId);
                        client.createCollection(databaseUrl, {id: collectionId}, requestOptions, (err, created) => {
                            if (err) {
                                debug(err);
                                console.error(err);
                                reject(err)
                            } else {
                                debug("Collection (%s) Created", collectionId);
                            }
                        });
                    }
                    
                    resolve();
                }
            });
        }).then((result) => {
            if (collectionIndex < Database.collections.length - 1)
                return this.initializeCollections(collectionIndex++, databaseUrl, client);
            else return;
        });
    }
}