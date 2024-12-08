import { Module, Global } from '@nestjs/common';
import { Pool } from 'pg';

@Global()
@Module({
    providers: [
        {
            provide: 'DATABASE_POOL',
            useFactory: () => {
                return new Pool({
                    host: process.env.DB_HOST || 'localhost',
                    port: parseInt(process.env.DB_PORT, 10) || 5433,
                    user: process.env.DB_USER || 'uzer',
                    password: process.env.DB_PASSWORD || 'pazzword',
                    database: process.env.DB_NAME || 'term_project',
                });
            },
        },
    ],
    exports: ['DATABASE_POOL'],
})
export class DatabaseConfig {}