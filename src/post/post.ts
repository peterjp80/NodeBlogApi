export class Post {
    id: string;
    title: string;
    description: string;
    html: string;
    tags: string[];
    createdOn: Date;
    publishedOn: Date;
    updatedOn: Date;

    static create(obj: any) {
        var post = new Post();

        if (!obj) return post;
        if (obj.id) post.id = obj.id;
        if (obj.title) post.title = obj.title;
        if (obj.description) post.description = obj.description;
        if (obj.html) post.html = obj.html;
        if (obj.tags) post.tags = obj.tags;
        if (obj.createdOn) post.createdOn = obj.createdOn;
        if (obj.publishedOn) post.publishedOn = obj.publishedOn;
        if (obj.updatedOn) post.updatedOn = obj.updatedOn;

        return post;
    }
}