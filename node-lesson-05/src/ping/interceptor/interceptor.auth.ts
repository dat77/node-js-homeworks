import {CallHandler, ExecutionContext, Injectable, NestInterceptor, UnauthorizedException} from "@nestjs/common";
import {Observable} from "rxjs";
import { map } from 'rxjs/operators';

export interface Response<T> {
    message: T;
}

@Injectable()
export class InterceptorAuth<T> implements NestInterceptor {
    intercept(context: ExecutionContext, next: CallHandler<any>): Observable<Response<T>> | Promise<Observable<Response<T>>> {
        const request = context.switchToHttp().getRequest();
        const authorization = request.headers['authorization'];

        if (!authorization) {
            throw new UnauthorizedException('Token is required');
        }
        if (!(/\S+@\S+\.\S{2,}/.test(authorization))) {
            throw new UnauthorizedException('Token is invalid');
        }

        return next.handle().pipe(map( message =>({ message })));
    }

}