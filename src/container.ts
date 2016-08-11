import { defaultMetadataArgsStorage } from "routing-controllers";
import { MetadataArgsStorage } from "routing-controllers/metadata-builder/MetadataArgsStorage";

import { debug } from './';

class Container {
  static instances: { type: Function, object: any }[] = [
    {type: MetadataArgsStorage, object: defaultMetadataArgsStorage()}
  ];

  static get(someClass: any): any {
    try {
        debug("Getting %s from container", someClass.name);

        let instance = Container.instances.find(instance => instance.type === someClass);
        
        if (!instance) {
            debug("Could not find instance for %s", someClass.name);
            instance = { type: someClass, object: new someClass()};
            if (!instance) {
              throw new Error("Unable to construct an instance of " + someClass.name);
            }
            Container.instances.push(instance);
        }
        else {
          debug("Found instance for %s", someClass.name);
        }
          
        return instance.object;
    } catch (error) {
        console.error(error);
        return null;
    }    
  }

  static set(someClass: any, object: any) {
    try {
        let instance = { type: someClass, object: object};
        Container.instances.push(instance);
    } catch (error) {
        console.error(error);
        throw error;
    }
  }
}

export { Container }