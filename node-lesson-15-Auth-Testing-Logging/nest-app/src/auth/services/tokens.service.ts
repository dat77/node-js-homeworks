import { Injectable, Inject } from '@nestjs/common';
import { Pool } from 'pg';

@Injectable()
export class TokensService {
  constructor(@Inject('DATABASE_POOL') private readonly pool: Pool) {}

  async saveTokens(
    userId: number,
    accessToken: string,
    refreshToken: string,
  ): Promise<void> {
    await this.pool.query(
      'INSERT INTO tokens (user_id, access_token, refresh_token) VALUES ($1, $2, $3)',
      [userId, accessToken, refreshToken],
    );
  }

  async refreshTokens(
      userId: number,
      accessToken: string,
      refreshToken: string,
  ): Promise<void> {
    await this.pool.query(
        'UPDATE tokens SET access_token = $2, refresh_token = $3 WHERE user_id = $1',
        [userId, accessToken, refreshToken],
    );
  }

  async findAccessToken(accessToken: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM tokens WHERE access_token = $1',
      [accessToken],
    );
    return result.rows[0];
  }

  async findRefreshToken(refreshToken: string): Promise<any> {
    const result = await this.pool.query(
      'SELECT * FROM tokens WHERE refresh_token = $1',
      [refreshToken],
    );
    return result.rows[0];
  }

  async refreshAccessToken(newAccessToken: string, refreshToken: string): Promise<void> {
    await this.pool.query('UPDATE tokens SET access_token = $1 WHERE refresh_token = $2', [
      newAccessToken, refreshToken
    ]);
  }

  async deleteAccessToken(accessToken: string): Promise<void> {
    await this.pool.query('DELETE FROM tokens WHERE access_token = $1', [
      accessToken,
    ]);
  }

  async deleteRefreshToken(refreshToken: string): Promise<void> {
    await this.pool.query('DELETE FROM tokens WHERE refresh_token = $1', [
      refreshToken,
    ]);
  }

  async deleteTokensByUserId(userId: number): Promise<void> {
    await this.pool.query('DELETE FROM tokens WHERE user_id = $1', [userId]);
  }
}
