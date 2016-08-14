import { DocumentClient } from 'documentdb'

import { Container } from './container';
import { Config, PostRepository, PostController } from './';

Container.set(Config, new Config);
// Container.set(DocumentClient, new DocumentClient()
// Container.set(PostRepository, new PostRepository(DocumentClient, Container.get(Config)));
// Container.set(PostController, new PostController(Container.get(PostRepository)));