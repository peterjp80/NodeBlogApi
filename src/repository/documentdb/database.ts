import { Config, debug } from '../../';
import { DocumentClient, SqlQuerySpec } from 'documentdb';

export class Database {
    constructor(private config: Config) {
        if (!Config.isTestEnvironment()) {
            config = new Config();
        }
    }

    private static collections = ['Posts'];
    public static client: DocumentClient;

    connect(): Promise<any> {
        let self = this;
        var databaseUrl = 'dbs/' + this.config.databaseName;

        debug("Database=%s", this.config.databaseName);
        var c = new DocumentClient(this.config.connectionString, {masterKey: this.config.databaseAuthKey});
        return self.initializeDatabase(c)
            .then((result) => { 
                return self.initializeCollections(0, databaseUrl, c)
            }).then((result) => {
                    debug("Database Connected");
                    Database.client = c;
                }).catch((err) => {
                    debug(err)
                });
    
    }

    private initializeDatabase(client: DocumentClient): Promise<any> {
        debug("Checking database and collections");
        let querySpec = <SqlQuerySpec>{
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: this.config.databaseName
            }]
        };

        debug("querySpec set");
        return new Promise((resolve, reject) => {
            try {
                client.queryDatabases(querySpec).toArray((err, results) => {
                    if (err) { 
                        debug("Error querying databases");                   
                        debug(err);
                        reject(err);
                    } else {
                        if (results.length === 0) {
                            debug("Creating Database");
                            client.createDatabase({id: this.config.databaseName}, (err, created) => {
                                if (err) {
                                    debug("Error creating database")
                                    debug(err);
                                    reject(err);
                                } else {
                                    debug("Database (%s) Created", this.config.databaseName)
                                    resolve();
                                } 
                            })
                        }
                        else resolve();                    
                    }            
                });
            } catch (error) {
                debug("Error querying");
                debug(error);
                reject(error);
            }            
        });               
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

        debug("Database url: %s", databaseUrl);
        return new Promise<any> ((resolve, reject) => {
            client.queryCollections(databaseUrl, querySpec).toArray((err, results) => {
                if (err) {                    
                    debug("Error querying collections");
                    debug(err);
                    reject(err);
                } else {
                    if (results.length === 0) {
                        var requestOptions = {
                            offerType: this.config.collectionPerformanceLevel
                        }

                        debug("Creating Collection (%s)", collectionId);
                        client.createCollection(databaseUrl, {id: collectionId}, requestOptions, (err, created) => {
                            if (err) {
                                debug("Error creating collection");
                                debug(err);
                                reject(err)
                            } else {
                                debug("Collection (%s) Created", collectionId);
                                resolve();
                            }
                        });
                    }
                    else resolve();                    
                }
            });
        }).then((result) => {
            if (collectionIndex < Database.collections.length - 1)
                return this.initializeCollections(collectionIndex++, databaseUrl, client);
            else return;
        }).catch((err) => {
            debug(err);
        })
    }
}