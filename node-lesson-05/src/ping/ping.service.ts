import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
    getPing(): string {
        return 'OK';
    }
    getTest(): string {
        return 'Test OK';
    }
}