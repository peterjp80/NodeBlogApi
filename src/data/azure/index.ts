import { Config, debug } from '../../';
import { DocumentClient, SqlQuerySpec } from 'documentdb';

export class Database {
    constructor(private config: Config) {

    }

    private static collections = ['Posts'];
    public static client: DocumentClient;

    connect() {
        let self = this;
        var databaseUrl = 'dbs/' + this.config.DatabaseName;

        var c = new DocumentClient(this.config.ConnectionString, {masterKey: this.config.DatabaseAuthKey});
        self.initializeDatabase(c).then((result) => { return self.initializeCollections(0, databaseUrl, c)}).then((result) => {
            Database.client = c;
        });
    }

    private initializeDatabase(client: DocumentClient): Promise<any> {
        let querySpec = <SqlQuerySpec>{
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: this.config.DatabaseName
            }]
        };

        return new Promise((resolve, reject) => {
            Database.client.queryDatabases(querySpec).toArray((err, results) => {
                if (err) {
                    debug(err);
                    console.error(err);
                    reject(err);
                } else {
                    if (results.length === 0) {
                        Database.client.createDatabase({id: this.config.DatabaseName}, (err, created) => {
                            if (err) {
                                debug(err);
                                console.error(err);
                                reject(err);
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
        let querySpec = <SqlQuerySpec>{
            query: 'SELECT * FROM root r WHERE r.id = @id',
            parameters: [{
                name: '@id',
                value: collectionId
            }]
        };

        return new Promise<any> ((resolve, reject) => {
            Database.client.queryCollections(databaseUrl, querySpec).toArray((err, results) => {
                if (err) {
                    debug(err);
                    console.error(err);
                    reject(err);
                } else {
                    if (results.length === 0) {
                        var requestOptions = {
                            offerType: this.config.CollectionPerformanceLevel
                        }

                        client.createCollection(databaseUrl, {id: collectionId}, requestOptions, (err, created) => {
                            if (err) {
                                debug(err);
                                console.error(err);
                                reject(err)
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