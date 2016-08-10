import "reflect-metadata";
import { JsonController, Param, Body, Get, Post, Put, Delete, Res, HttpCode } from "routing-controllers";
import { Response } from 'express';

import { Post as BlogPost, IPostRepository, PostRepository } from '../';

@JsonController()
class PostController {
    constructor(private postRepository: PostRepository) {
        console.log("Constructing PostController");
        console.log(postRepository);
    }

    @Get("/post")
    async getAll() {
        return await this.postRepository.getAll();
    }

    @Get("/post/:id")
    async get(@Param("id") id: string) {
        console.log("Post ID: %s", id);
        let p =  await this.postRepository.get(id);

        console.log("Post Title: %s", p.title);
        return p;
    }

    @HttpCode(201)
    @Post("/post")
    async create(@Body() post: BlogPost, @Res() response: Response) {
        var createdPost = await this.postRepository.create(post);
        // TODO: Add location to new post in Location header
        response.setHeader("Location", "");
    }

    @HttpCode(204)
    @Put("/post/:id")
    async update(@Param("id") id: string, @Body() post: BlogPost) {
        post.id = id;
        await this.postRepository.update(post);
    }

    @HttpCode(204)
    @Delete("/post/:id")
    async remove(@Param("id") id: string) {
        await this.postRepository.delete(id);
    }
}

export { PostController };