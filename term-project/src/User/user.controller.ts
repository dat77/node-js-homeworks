import {Controller, Get, Param, Post, Body, Delete, UseGuards} from '@nestjs/common';
import { UserService } from './user.service';
import { ApiProperty, ApiBearerAuth } from '@nestjs/swagger';
import { AuthGuard } from "../auth/auth.guard";

export class CreateUserDto {
    @ApiProperty()
    username: string;
    @ApiProperty()
    password: string;
    @ApiProperty()
    email: string;
}

// @UseGuards(AuthGuard)
// @ApiBearerAuth()
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