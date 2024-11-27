import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../users/users.service';
import { TokensService } from './tokens.service';
import * as bcrypt from 'bcrypt';
import any = jasmine.any;

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly usersService: UsersService,
    private readonly tokensService: TokensService,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findPasswordUsername(username);
    if (!user) return null;

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (passwordMatch) {
      return user;
    }
    return null;
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.id };
    const currUser = await this.usersService.findOneByUsername(user.username);

    if (currUser) {
      const access_decoded = this.jwtService.verify(currUser.access_token, {
        secret: process.env.JWT_SECRET,
      });
      if ( access_decoded.exp > Math.trunc(new Date().valueOf() / 1000) ) {
        return {
          access_token: currUser.access_token,
          refresh_token: currUser.refresh_token,
        };
      } else {
        const refresh_decoded = this.jwtService.verify(currUser.refresh_token, {
          secret: process.env.JWT_SECRET,
        });
        if ( refresh_decoded.exp > Math.trunc(new Date().valueOf() / 1000) ) {
          const newAccessToken = this.jwtService.sign(payload, { expiresIn: '3h' });
          await this.tokensService.refreshAccessToken(newAccessToken, currUser.refresh_token);
          return {
            access_token: newAccessToken,
            refresh_token: currUser.refresh_token,
          };
        }
      }
    }

    const accessToken = this.jwtService.sign(payload, { expiresIn: '3h' });
    const refreshToken = this.jwtService.sign(payload, { expiresIn: '7d' });
    if (currUser) {
      await this.tokensService.refreshTokens(user.id, accessToken, refreshToken);
    } else {
      await this.tokensService.saveTokens(user.id, accessToken, refreshToken);
    }
    return {
      access_token: accessToken,
      refresh_token: refreshToken,
    };
  }

  async refreshAccessToken(
    refreshToken: string,
  ): Promise<{ access_token: string }> {
    const storedToken = await this.tokensService.findRefreshToken(refreshToken);

    if (!storedToken) {
      throw new Error('Refresh token not found');
    }

    try {
      const decoded = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_SECRET,
      });

      const newAccessToken = this.jwtService.sign(
        { username: decoded.username, sub: decoded.sub },
        { expiresIn: '15m', secret: process.env.JWT_SECRET },
      );

      await this.tokensService.saveTokens(
        decoded.sub,
        newAccessToken,
        refreshToken,
      );

      return { access_token: newAccessToken };
    } catch (err) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async logout(accessToken: string): Promise<void> {
    await this.tokensService.deleteAccessToken(accessToken);
  }
}
