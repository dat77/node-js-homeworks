import {Controller, Get, Param, Post, Body, Delete} from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Post()
    async createUser(@Body() body:{ userName: string; password: string; email: string }): Promise<any> {
        await this.userService.createUser(body.userName, body.password, body.email);
        return { message: `User ${body.userName} created successfully` };
    }

    @Get(':username')
    async findUser(@Param('username') username: string) {
        return this.userService.findUserByUsername(username);
    }

    @Delete(':username')
    async deleteUser(@Param('username') username: string) {
        await this.deleteUser(username);
        return { message: `User ${username} removed successfully` };
    }
}