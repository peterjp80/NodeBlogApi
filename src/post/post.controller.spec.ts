import { Post } from './post';
import { PostController } from './post.controller';
import { MockPostRepository } from './mock-post.repository';


describe('PostController: getAll', () => {
  let controller: PostController;
  let repository: MockPostRepository;
  beforeEach(() => {
    repository = new MockPostRepository();
    controller = new PostController(repository);
  });

  it('calls the repository getAll() function', () => {
    spyOn(repository, "getAll");
    controller.getAll();
    expect(repository.getAll).toHaveBeenCalled();
  })

  it('should return all posts', (done) => {
    var testPosts = function(posts: Post[]) {
      expect(posts.length).toBe(2);
      expect(posts[0].id).toBe('post-1');
      expect(posts[1].id).toBe('post-2');
    }

    controller.getAll().then(testPosts).then(done);
  });


})