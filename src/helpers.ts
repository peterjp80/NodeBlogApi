import { Response, Request } from 'express';

import { debug } from './';

export class Helpers {
  static isTestEnvironment(): boolean {
    return process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase() === 'test';
  }

  static isProdEnvironment(): boolean {
    return process.env.NODE_ENV && process.env.NODE_ENV.toLowerCase().startsWith('prod')
  }

  static userFriendlyErrors(promise: Promise<any>): Promise<any> {
    debug("userFriendlyErrors");
    return promise.then(() => {
      debug("userFriendlyErrors then");
    }).catch((err) => {
      debug("userFriendlyErrors catch");
      console.error(err);
      throw new Error("We're sorry, an unexpected error occurred.  Please try your request again.");
    });
  }

  // This should really be an ErrorHandler registered with express server but due to a 
  // bug in the routing-controllers library that can't be accomplished at the moment.
  // BUG: The handleErrors() method in ExpressDriver calls response.json(), so my ErrorHandler can't
  static async executeAction(response: Response, action: any): Promise<any> {
    try {
        return await action();
    } catch (error) {      
        console.error(error);
        response.status(500).json({"errorMessage": "We're sorry, an unexpected error occurred.  Please try your request again."});
    }
  }

  static buildLocationUrl(request: Request, resource: string, id: string): string {
    return request.protocol + '://' + request.get('host') + '/api/' + resource + '/' + id;
  }
}
