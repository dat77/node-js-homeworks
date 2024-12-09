import {Controller, Get, Param, Post, Body, Delete} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    email: string;
}

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() body: CreateUserDto ): Promise<any> {
        await this.userService.createUser(body.username, body.password, body.email);
        return { message: `User ${body.username} created successfully` };
    }

    @Get(':username')
    async findUser(@Param('username') username: string) {
        return this.userService.findUserByUsername(username);
    }

    @Get()
    async findAll() {
        return this.userService.findAll();
    }

    @Delete(':username')
    async deleteUser(@Param('username') username: string) {
        await this.userService.deleteUserByUsername(username);
        return { message: `User ${username} removed successfully` };
    }
}