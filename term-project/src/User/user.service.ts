import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

    private _saltRounds = 10;

    get saltRounds(): number {
        return this._saltRounds;
    }

    async createUser(username: string, password: string, email: string) {
        const hashedPassword = await bcrypt.hash(password, this.saltRounds);
        await this.pool.query(
            'INSERT INTO users (username, password, email) VALUES ($1, $2, $3)',
            [username, hashedPassword, email],
        );
    }

    async findUserByUsername(username: string): Promise<any> {
        const result = await this.pool.query(
            'SELECT * FROM users WHERE username = $1',
            [username],
        );
        return result.rows[0];
    }

    async deleteUserByUsername(username: string): Promise<any> {
        await this.pool.query('DELETE FROM users WHERE username = $1', [username]);
    }

}
