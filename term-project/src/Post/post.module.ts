import { Module } from '@nestjs/common';
import { PostService} from "./post.service";
import { PostController} from "./post.controller";
import {JwtModule} from "@nestjs/jwt";
import {AuthModule} from "../Auth/auth.module";

@Module({
    imports: [
        JwtModule.register({
            secret: process.env.JWT_SECRET || '*jwt*',
        }),
        AuthModule,
    ],
    controllers: [PostController],
    providers: [PostService],
    exports: [PostService],
})
export class PostModule {}