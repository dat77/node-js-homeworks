import { Injectable, CanActivate, ExecutionContext, UnauthorizedException} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Observable } from "rxjs";
import { Request } from "express";

@Injectable()
export class PingAuth implements CanActivate {
    constructor(private reflector : Reflector) {}

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];

        if (!authorization) {
            throw new UnauthorizedException('Token is required');
        }
        if (!(/\S+@\S+\.\S{2,}/.test(authorization))) {
            throw new UnauthorizedException('Token is invalid');
        }
        return true;
    }

}