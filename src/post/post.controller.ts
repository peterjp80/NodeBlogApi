import "reflect-metadata";
import { JsonController, Param, Body, Get, Post, Put, Delete, Res, Req, HttpCode, EmptyResultCode } from "routing-controllers";
import { Response, Request } from 'express';

import { Post as BlogPost, Helpers, IPostRepository, PostRepository, debug } from '../';

@JsonController()
class PostController {
    constructor(private postRepository?: IPostRepository) {        
        debug("Constructing PostController");
        if (!Helpers.isTestEnvironment() && !postRepository) this.postRepository = new PostRepository();
    }

    @Get("/post")
    async getAll(@Res() response: Response) {
        return await Helpers.executeAction(response, () => {
            return this.postRepository.getAll();  
        });         
    }

    @Get("/post/:id")
    async get(@Param("id") id: string, @Res() response: Response) {
        debug("Post ID: %s", id);
        return await Helpers.executeAction(response, () => { return this.postRepository.get(id); });
    }

    @HttpCode(201)
    @Post("/post")
    async create(@Body() post: BlogPost, @Res() response: Response, @Req() request: Request) {
        var createdPost = await Helpers.executeAction(response, () => { return this.postRepository.create(post); });

        if (!response.headersSent)
            response.setHeader("Location", Helpers.buildLocationUrl(request, 'post', createdPost.id));

        return createdPost;
    }

    @HttpCode(204)
    @EmptyResultCode(204)
    @Put("/post/:id")
    async update(@Param("id") id: string, @Body() post: BlogPost, @Res() response: Response) {
        post.id = id;
        debug("updating post");
        await Helpers.executeAction(response, () => { return this.postRepository.update(post); });
        debug("post updated");        
        return null;        
    }

    @HttpCode(204)
    @Delete("/post/:id")
    async remove(@Param("id") id: string, @Res() response: Response) {
        await Helpers.executeAction(response, () => { return this.postRepository.delete(id); });
    }
}

export { PostController };