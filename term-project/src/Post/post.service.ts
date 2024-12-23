import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import { Cache } from "cache-manager";
import { CACHE_MANAGER } from "@nestjs/cache-manager";

@Injectable()
export class PostService {
    constructor(@Inject('DATABASE_POOL') private readonly pool: Pool,
                @Inject(CACHE_MANAGER) private cache: Cache) {}

    async createPost(username: string, post: string) {
        await this.pool.query(
            'INSERT INTO posts (user_id, post) VALUES ( (SELECT id FROM users WHERE username = $1), $2)',
            [username, post],
        );
        const cacheKey = `user:${username}`;
        let cachedPosts:{}[] = await this.cache.get(cacheKey);
        if (cachedPosts) {
            cachedPosts.push({"username": username,"post": post, "created_at": new Date().toString()});
            await this.cache.set(cacheKey, cachedPosts);
        }
    }

    async findPostsByUsername(username: string): Promise<any> {
        const cacheKey = `user:${username}`;
        let cachedPosts:{}[] = await this.cache.get(cacheKey);
        if (cachedPosts) {
            return cachedPosts;
        }
        const result = await this.pool.query(
            'SELECT users.username, posts.post, posts.created_at ' +
            'FROM users ' +
            'INNER JOIN posts ON posts.user_id = users.id ' +
            'WHERE users.username = $1',
            [username],
        );
        if (result.rows.length > 0) {
            await this.cache.set(cacheKey, result.rows);
        }
        return result.rows;
    }


}