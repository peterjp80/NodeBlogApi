import { Response, Request } from 'express';

import { debug } from '../';

abstract class BaseController {
    // This should really be an ErrorHandler registered with express server but due to a 
  // bug in the routing-controllers library that can't be accomplished at the moment.
  // BUG: The handleErrors() method in ExpressDriver calls response.json(), so my ErrorHandler can't
  async executeAction(response: Response, action: any): Promise<any> {
    try {
      return await action().catch((error: any) => {
          debug("Error caught in executeAction promise") 
          console.error(error);
          response.status(500).json({"errorMessage": "We're sorry, an unexpected error occurred.  Please try your request again."});
      });
    } catch (error) {
      debug("Error caught in executeAction")
      console.error(error);
      response.status(500).json({"errorMessage": "We're sorry, an unexpected error occurred.  Please try your request again."});
    }
    
  }

  sendError(response: Response, code: number, message: string) {
    response.status(code).json({"errorMessage": message});
  }

  buildLocationUrl(request: Request, resource: string, id: string): string {
    return request.protocol + '://' + request.get('host') + '/api/' + resource + '/' + id;
  }
}

export { BaseController }