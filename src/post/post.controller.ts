import {Controller, Param, Body, Get, Post, Put, Delete} from "routing-controllers";

@Controller("/post")
export class PostController {
    @Get("/")
    getAll() {

    }

    @Get("/:id")
    get(@Param("id") id: number) {

    }
}