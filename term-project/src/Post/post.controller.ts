import {Controller, Get, Param, Post, Body, UseGuards} from '@nestjs/common';
import { PostService } from './post.service';
import { ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from "../auth/auth.guard";
import { CreatePostDto} from "./dto/post.dto";

@UseGuards(AuthGuard)
@ApiBearerAuth()
@Controller('post')
export class PostController {
    constructor(private readonly postService: PostService) {}

    @Post()
    async createPost(@Body() body: CreatePostDto): Promise<any> {
        await this.postService.createPost(body.username, body.post);
        return { message: `Post of ${body.username} created successfully` };
    }

    @Get(':username')
    async findPostsByUsername(@Param('username') username: string) {
        return this.postService.findPostsByUsername(username);
    }

}