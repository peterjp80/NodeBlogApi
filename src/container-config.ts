import { Container } from './container';
import { PostRepository, PostController } from './';

Container.set(PostRepository, new PostRepository());
Container.set(PostController, new PostController(Container.get(PostRepository)));