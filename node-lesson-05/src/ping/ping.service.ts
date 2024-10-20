import { Injectable } from '@nestjs/common';

@Injectable()
export class PingService {
    getPing(): string {
        return JSON.stringify({ message: 'OK' });
    }
}