import {Controller, Get, Param, Post, Body, Delete} from '@nestjs/common';
import { PostService } from './post.service';

@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    async createPost(@Body() body:{ username: string; post: string }): Promise<any> {
        await this.postService.createPost(body.username, body.post);
        return { message: `Post of ${body.username} created successfully` };
    }

    @Get(':username')
    async findPostsByUsername(@Param('username') username: string) {
        return this.postService.findPostsByUsername(username);
    }

}