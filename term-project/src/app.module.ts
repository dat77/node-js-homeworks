import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { PostModule } from "./post/post.module";
import { DatabaseConfig } from "./database/database.config";
import { CacheModule } from "@nestjs/cache-manager";
import * as redisStore from 'cache-manager-redis-store';
import {AuthModule} from "./auth/auth.module";

@Module({
  imports: [ConfigModule.forRoot(),
            DatabaseConfig,
            CacheModule.register({
                isGlobal: true,
                store: redisStore,
                host: process.env.REDIS_HOST || 'redis',
                port: parseInt(process.env.REDIS_PORT, 10) || 6379,
                ttl: parseInt(process.env.REDIS_TTL, 10) || 600, // seconds
            }),
            UserModule,
            PostModule,
            AuthModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
