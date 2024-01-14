import { Inject, Injectable } from '@nestjs/common';
import { Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { ExtractJwt } from 'passport-jwt';
import { Request } from 'express';
import { TokenPayload } from '../interfaces/token-payload.interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    private readonly configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: any) => {
          console.log('requ', request);

          const token =
            request?.cookies?.Authetication || request?.Authetication;

          console.log(request?.Authetication);
          console.log(token);
          return token;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: configService.get('JWT_SECRET') || 'secretKey',
    });
  }

  async validate({ userId }: TokenPayload) {
    console.log('Executing validate method...');
    console.log('Received userId:', userId);

    // Your validation logic
    const user = await this.usersService.getUser({ _id: userId });

    if (!user) {
      throw new Error('Userrrrrrrrrrrrrr not found');
    }
    console.log('User after validation:', user);

    return user;
  }
}
