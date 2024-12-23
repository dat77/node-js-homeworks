import {ApiProperty} from "@nestjs/swagger";

export class CreatePostDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    post: string;
}