import { Request, Response } from 'express';
import { Post } from '../../../src/models/post';
import { PostController } from '../../../src/controllers/post.controller';
import { PostRepository as MockPostRepository } from '../../../src/repository/mock/post.repository';
import { debug } from '../../../src/debug';

class MockResponse {
  public statusCode: number;
  public body: any;
  public headers: any = {};

  status(code: number) {
    this.statusCode = code;
  }

  json(obj: any) {
    this.body = obj;
  }

  setHeader(key: string, value: any) {
    this.headers[key] = value;
  }
}

class MockRequest {
  public protocol = 'http';

  get(param: string): string {
    if (param == 'host')
      return 'localhost:8080';
    
    return null;
  }
}

describe('PostController', () => {
  let controller: PostController;
  let repository: MockPostRepository;
  beforeEach(() => {
    repository = new MockPostRepository();
    controller = new PostController(repository);
  });

  it('getAll() calls the repository getAll() function', () => {
    spyOn(repository, "getAll");
    controller.getAll(null);
    expect(repository.getAll).toHaveBeenCalled();
  })

  it('getAll() should return all posts', (done) => {
    var testPosts = function(posts: Post[]) {
      expect(posts.length).toBe(2);
      expect(posts[0].id).toBe('post-1');
      expect(posts[1].id).toBe('post-2');
    }

    controller.getAll(null).then(testPosts).then(done);
  });

  it('getAll() should set 500 status code on response when getAll fais', () => {
    let res = new MockResponse();
    spyOn(repository, "getAll").and.throwError("fake error");
    controller.getAll(<Response><any>res);
    expect(res.statusCode).toBe(500);
  })

  it('get() calls the repository get() function', () => {
    spyOn(repository, "get");
    controller.get("test-id", null);
    expect(repository.get).toHaveBeenCalledWith("test-id");
  })

  it('get() should return the post', (done) => {
    var testPost = function(post: Post) {
      expect(post.id).toBe("post-1");
    }

    controller.get("post-1", null).then(testPost).then(done);
  })

  it('get() should set 500 status code on response when get fails', () => {
    let res = new MockResponse();
    spyOn(repository, "get").and.throwError("fake error");
    controller.get("test-id", <Response><any>res);
    expect(res.statusCode).toBe(500);
  })

  it('create() calls the repository create() function', () => {
    spyOn(repository, "create");
    let post = <Post>{
      id: "test-id",
      title: "test title"
    };

    controller.create(post, null, null);
    expect(repository.create).toHaveBeenCalledWith(post);
  })

  it('create() sets Location header', (done) => {
    let res = new MockResponse();
    let req = new MockRequest();
    let post = <Post>{
      id: "test-id",
      title: "test title"
    };

    spyOn(repository, "create").and.returnValue(new Promise((resolve, reject) => resolve(post)));

    controller.create(post, <Response><any>res, <Request>req).then(() => {
      expect(res.headers).toBeTruthy();
      expect(res.headers.Location).toBe("http://localhost:8080/api/post/test-id");
    }).then(done);    
  })

  it('create() returns the newly created post', (done) => {
    let res = new MockResponse();
    let req = new MockRequest();
    let post = <Post>{
      id: "test-id",
      title: "test title"
    };

    spyOn(repository, "create").and.returnValue(new Promise((resolve, reject) => resolve(post)));

    controller.create(post, <Response><any>res, <Request>req).then((result) => {
      expect(result).toBeTruthy();
      expect(result.id).toBe("test-id");
      expect(result.title).toBe("test title");
    }).then(done);  
  })

  it('update() calls the repository update() function and provides the id in the model', () => {
    spyOn(repository, "update");
    let post = <Post>{
      title: "test title"
    };

    controller.update("test-id", post, null);
    expect(repository.update).toHaveBeenCalledWith(<Post>{id: "test-id", title: "test title"});
  })

  it('update() returns null', (done) => {
    let post = <Post>{
      title: "test title"
    };

    controller.update("test-id", post, null).then((result) => expect(result).toBeNull()).then(done);
  })

  it('remove() calls the repository delete() function', () => {
    spyOn(repository, "delete");
    controller.remove("test-id", null);
    expect(repository.delete).toHaveBeenCalledWith("test-id");
  })

  it('remove() returns null', (done) => {
    controller.remove("test-id", null).then((result) => expect(result).toBeNull()).then(done);
  })
})