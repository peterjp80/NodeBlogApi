import { Config, Database, debug } from '../../';

import { DocumentClient, SqlQuerySpec, RetrievedDocument } from 'documentdb'

export abstract class BaseRepository {
  constructor(protected collectionName: string, protected client?: DocumentClient, protected config?: Config) {
    if (!Config.isTestEnvironment()) {
      if (!client) this.client = Database.client;
      if (!config) this.config = new Config();
    }    
    debug(this.config);
    this.collectionUrl = 'dbs/' + this.config.databaseName + '/colls/' + this.collectionName;
  }

  protected collectionUrl: string;

  getItem<T>(id: string): Promise<RetrievedDocument<T>> {
    let querySpec = <SqlQuerySpec>{
      query: 'SELECT * FROM root r WHERE r.id = @id',
      parameters: [{
        name: '@id',
        value: id
      }]
    };

    return new Promise<RetrievedDocument<T>>((resolve, reject) => {
      this.client.queryDocuments<T>(this.collectionUrl, querySpec).toArray((err, results) => {
        if (err) reject(err);
        else resolve(results ? results[0] : null);
      })
    })
  };

  createItem<T>(item: any): Promise<RetrievedDocument<T>> {
    let date: Date = new Date(Date.now());
    if ('createdOn' in item) item.createdOn = date;
    if ('updatedOn' in item) item.updatedOn = date;

    return new Promise<RetrievedDocument<T>>((resolve, reject) => {
      this.client.createDocument<T>(this.collectionUrl, item, (err, doc) => {
        if (err) reject(err);
        else resolve(doc)
      });
    });
  };

  updateItem(item: any): Promise<any> {
    if (!('id' in item))
      throw "An item with an 'id' property is required.";

    let date: Date = new Date(Date.now());
    if ('updatedOn' in item) item.updatedOn = date;

    let documentUrl = this.collectionUrl + '/docs/' + item.id;
    debug("documentUrl: %s", documentUrl); 

    return new Promise<any>((resolve, reject) => {
    this.client.replaceDocument(documentUrl, item, (err, doc) => {
      if (err) reject(err);
      resolve();      
    });    
      
    });
  }

  deleteItem(id: string): Promise<any> {
    let documentUrl = this.collectionUrl + '/docs/' + id;
    debug("documentUrl: %s", documentUrl);
    return new Promise<any>((resolve, reject) => {
      this.client.deleteDocument(documentUrl, (err) => {
        if (err) reject(err);
        resolve();
      })
    })
  }

}