import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class PostService {
    constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

    async createPost(username: string, post: string) {
        await this.pool.query(
            'INSERT INTO posts (user_id, post) VALUES ( (SELECT id FROM users WHERE username = $1), $2)',
            [username, post],
        );
    }

    async findPostsByUsername(username: string): Promise<any> {
        const result = await this.pool.query(
            'SELECT users.username, posts.post, posts.created_at ' +
            'FROM users ' +
            'INNER JOIN posts ON posts.user_id = users.id ' +
            'WHERE users.username = $1',
            [username],
        );
        return result.rows;
    }


}