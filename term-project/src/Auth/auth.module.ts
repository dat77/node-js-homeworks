import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UserModule } from '../user/user.module';
import { TokenService } from './token.service';
import {APP_GUARD} from "@nestjs/core";
import {AuthGuard} from "./auth.guard";

@Module({
  imports: [
    UserModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET || '*jwt*',
    }),
  ],
  controllers: [AuthController],
  providers: [
  //    AuthGuard,
      AuthService,
      TokenService,
    // {
    //   provide: APP_GUARD,     // make it global applicable
    //   useExisting: AuthGuard, // this tells to use AuthGuard as value. will already be overridden at the time of resolving it
    // }
  ],
  exports: [TokenService],
})
export class AuthModule {}
