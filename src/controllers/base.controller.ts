import { Response, Request } from 'express';

abstract class BaseController {
    // This should really be an ErrorHandler registered with express server but due to a 
  // bug in the routing-controllers library that can't be accomplished at the moment.
  // BUG: The handleErrors() method in ExpressDriver calls response.json(), so my ErrorHandler can't
  async executeAction(response: Response, action: any): Promise<any> {
    try {
        return await action();
    } catch (error) {      
        console.error(error);
        response.status(500).json({"errorMessage": "We're sorry, an unexpected error occurred.  Please try your request again."});
    }
  }

  buildLocationUrl(request: Request, resource: string, id: string): string {
    return request.protocol + '://' + request.get('host') + '/api/' + resource + '/' + id;
  }
}

export { BaseController }