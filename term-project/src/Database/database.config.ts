import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
    providers: [
        {
            provide: 'DATABASE_POOL',
            useFactory: () => {
                return new Pool({
                    host: process.env.POSTGRES_HOST || 'db',
                    port: parseInt(process.env.POSTGRES_PORT, 10) || 5433,
                    user: process.env.POSTGRES_USER || 'uzer',
                    password: process.env.POSTGRES_PASSWORD || 'pazzword',
                    database: process.env.POSTGRES_NAME || 'term_project',
                });
            },
        },
    ],
    exports: ['DATABASE_POOL'],
})
export class DatabaseConfig {}