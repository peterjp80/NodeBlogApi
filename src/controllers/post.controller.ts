import "reflect-metadata";
import { JsonController, Param, Body, Get, Post, Put, Delete, Res, Req, HttpCode, EmptyResultCode } from "routing-controllers";
import { Response, Request } from 'express';

import { BaseController, Config, Post as BlogPost, IPostRepository, PostRepository, debug } from '../';

@JsonController()
class PostController extends BaseController {
    constructor(private postRepository?: IPostRepository) { 
        super();       
        
        if (!Config.isTestEnvironment() && !postRepository) 
            this.postRepository = new PostRepository();
    }

    @Get("/post")
    async getAll(@Res() response: Response) {
        debug("GET /post");
        return await super.executeAction(response, () => {
            return this.postRepository.getAll();  
        });         
    }

    @Get("/post/:id")
    @EmptyResultCode(404)
    async get(@Param("id") id: string, @Res() response: Response) {
        debug("GET /post/%s", id);
        return await super.executeAction(response, () => { return this.postRepository.get(id); });
    }

    @HttpCode(201)
    @Post("/post")
    async create(@Body() post: BlogPost, @Res() response: Response, @Req() request: Request) {
        debug ("POST /post")
        var createdPost = await super.executeAction(response, () => { 
            return this.postRepository.create(post)
                .catch((err) => {
                    debug("Error in Create Post");
                    console.log(err);
                    if (err && err.code === 409) {
                        super.sendError(response, 409, "A post with this id already exists.");
                        return null;
                    } else {
                        throw err;
                    }                    
                });
        });

        if (response && createdPost && createdPost.id && !response.headersSent)
            response.setHeader("Location", super.buildLocationUrl(request, 'post', createdPost.id));

        return createdPost;
    }

    @HttpCode(204)
    @EmptyResultCode(204)
    @Put("/post/:id")
    async update(@Param("id") id: string, @Body() post: BlogPost, @Res() response: Response) {
        debug ("PUT /post/%s", id);
        post.id = id;
        debug("updating post");
        await super.executeAction(response, () => { return this.postRepository.update(post); });
        debug("post updated");        
        return null;        
    }

    @HttpCode(204)
    @Delete("/post/:id")
    async remove(@Param("id") id: string, @Res() response: Response) {
        debug("DELETE /post/%s", id)
        await super.executeAction(response, () => { return this.postRepository.delete(id); });
        return null;
    }
}

export { PostController };