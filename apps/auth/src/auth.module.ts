import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UsersModule } from './users/users.module';
import { DatabaseModule } from '@app/common';
import {
  UserDocument,
  UserSchema,
} from '../../../libs/common/src/models/user.schema';
import { LoggerModule } from 'nestjs-pino';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import * as Joi from 'joi';
import { LocalStrategy } from './strategies/local.strategy';
import { JwtStrategy } from './strategies/jwt.strategy';
import { UsersService } from './users/users.service';
import { UsersRepository } from './users/users.repository';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Module({
  imports: [
    DatabaseModule,

    DatabaseModule.forFeature([
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
    UsersModule,
    // LoggerModule,
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/auth/.env',
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
        JWT_SECRET: Joi.string().required(),
        JWT_EXPIRATION: Joi.string().required(),
      }),
    }),
    JwtModule.registerAsync({
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: { expiresIn: `${configService.get('JWT_EXPIRATION')}` },
      }),
      inject: [ConfigService],
    }),
  ],

  controllers: [AuthController],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    // UsersService,
    // ConfigService,
    // UsersRepository,
    // JwtAuthGuard,
  ],
})
export class AuthModule {}
