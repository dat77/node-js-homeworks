import { Injectable, CanActivate, ExecutionContext,
    UnauthorizedException, ForbiddenException } from "@nestjs/common";
import { Observable } from "rxjs";
import { JwtService } from '@nestjs/jwt';
import { TokenService } from './token.service';
import * as process from "node:process";

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(
        private readonly jwtService: JwtService,
        private readonly tokenService: TokenService,
    ) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorizationHeader = request.headers['authorization'];

        if (!authorizationHeader || !authorizationHeader.startsWith('Bearer ')) {
            throw new ForbiddenException('Token is missing');
        }
        const token = authorizationHeader.replace('Bearer ', '').trim();
        return this.validateTokens(token, request);
    }

    private async validateTokens(token: string, request: any): Promise<boolean> {
        try {
            const decoded = this.jwtService.verify(token, {
                secret: process.env.JWT_SECRET || '*jwt*',
            });
            let storedToken = await this.tokenService.findAccessToken(token);
            if (!storedToken) {
                storedToken = await this.tokenService.findRefreshToken(token);
                if (storedToken){
                    await this.refreshToken(token, decoded, request);
                    return true;
                }
                return false; //throw new UnauthorizedException('Access token is compromised');
            }
            request.user = decoded;
            return true;
        } catch (err) {
            throw new UnauthorizedException('Invalid or expired access token');
        }
    }

    private async refreshToken(token: string, decoded:any, request: any): Promise<void> {
        const newAccessToken = this.jwtService.sign(
            { username: decoded.username, sub: decoded.sub },
            { expiresIn: '2m'},
        );
        await this.tokenService.saveTokens(decoded.sub, newAccessToken, token);
        request.user = decoded;
        request.newAccessToken = newAccessToken;
    }
}