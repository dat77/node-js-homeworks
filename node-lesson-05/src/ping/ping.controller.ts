import {Controller, Get, UseGuards} from '@nestjs/common';
import { PingService } from './ping.service';
import { PingAuth } from "./guard/guard.auth";

@Controller('/ping')
export class PingController {
    constructor(private readonly pingService: PingService) {}

    @UseGuards(PingAuth)
    @Get()
    getPing(): string {
        return this.pingService.getPing();
    }
}
