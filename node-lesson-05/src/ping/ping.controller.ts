import {Controller, Get, UseGuards, UseInterceptors} from '@nestjs/common';
import { PingService } from './ping.service';
import { PingAuth } from "./guard/guard.auth";
import { InterceptorAuth } from './interceptor/interceptor.auth';

export interface Resp<T> {
    message: T;
}

@Controller('/ping')
export class PingController {
    constructor(private readonly pingService: PingService) {}

    @UseGuards(PingAuth)
    @Get()
    getPing(): Resp<string> {
        return {message: this.pingService.getPing()} ;
    }

    @UseInterceptors(InterceptorAuth)
    @Get('/test')
    getTest(): string {
        return this.pingService.getTest();
    }

}
