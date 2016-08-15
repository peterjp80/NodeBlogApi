import { Post } from '../../../src/models/post';

describe("Post: create()", () => {
  it("copies id", () => {
    const expected = "TestId";
    var result = Post.create({id: expected});
    expect(result).not.toBeFalsy();
    expect(result.id).toBe(expected);
  })

  it("copies title", () => {
    const expected = "TestTitle";
    var result = Post.create({title: expected});
    expect(result).not.toBeFalsy();
    expect(result.title).toBe(expected);
  })

  it("copies html", () => {
    const expected = "TestHTML";
    var result = Post.create({html: expected});
    expect(result).not.toBeFalsy();
    expect(result.html).toBe(expected);
  })

  it("copies tags", () => {
    const expected1 = "TestTag1";
    const expected2 = "TestTag2";
    var result = Post.create({tags: [expected1, expected2]});
    expect(result).not.toBeFalsy();
    expect(result.tags).not.toBeFalsy();
    expect(result.tags.length).toBe(2);
    expect(result.tags[0]).toBe(expected1);
    expect(result.tags[1]).toBe(expected2);
  })

  it("copies createdOn", () => {
    const expected = new Date(Date.now());
    var result = Post.create({createdOn: expected});
    expect(result).not.toBeFalsy();
    expect(result.createdOn).toBe(expected);
  })

  it("copies publishedOn", () => {
    const expected = new Date(Date.now());
    var result = Post.create({publishedOn: expected});
    expect(result).not.toBeFalsy();
    expect(result.publishedOn).toBe(expected);
  })

  it("copies updatedOn", () => {
    const expected = new Date(Date.now());
    var result = Post.create({updatedOn: expected});
    expect(result).not.toBeFalsy();
    expect(result.updatedOn).toBe(expected);
  })

  it("does not error when there is a property that does not exist in Post", () => {
    const date = new Date(Date.now());
    const obj = {
      id: "TestID",
      title: "TestTitle",
      description: "TestDescription",
      html: "TestHTML",
      tags: ["TestTag1", "TestTag2"],
      createdOn: date,
      publishedOn: <any>null,
      updatedOn: date,
      somethingElse: "Hi",
      _rid: "Anything"
    };

    var result = Post.create(obj);
    expect(result).toBeTruthy();
    expect(result.id).toBe("TestID");
    expect(result.title).toBe("TestTitle");
    expect(result.description).toBe("TestDescription");
    expect(result.html).toBe("TestHTML");
    expect(result.tags).toBeTruthy();
    expect(result.tags.length).toBe(2);
    expect(result.createdOn).toBe(date);
    expect(result.publishedOn).toBeNull;
    expect(result.updatedOn).toBe(date);
  })
} )