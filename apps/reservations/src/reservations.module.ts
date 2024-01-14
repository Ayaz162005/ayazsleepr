import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service';
import { ReservationsController } from './reservations.controller';
import { DatabaseModule, JwtAuthGuard, PAYMENTS_SERVICE } from '@app/common'; // Assuming LoggerModule is not part of @app/common
import { ReservationsRepository } from './reservations.repository';
import {
  ReservationDocument,
  ReservationSchema,
} from './models/reservation.schema';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { LoggerModule } from 'nestjs-pino'; // Correct import statement
import * as Joi from 'joi';

import { Client, ClientsModule, Transport } from '@nestjs/microservices';
import { AUTH_SERVICE } from '@app/common';

import { UserDocument, UserSchema } from '@app/common/models/user.schema';

@Module({
  imports: [
    DatabaseModule,

    DatabaseModule.forFeature([
      {
        name: ReservationDocument.name,
        schema: ReservationSchema,
      },
      {
        name: UserDocument.name,
        schema: UserSchema,
      },
    ]),
    // LoggerModule, // Corrected import statement
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: './apps/reservations/.env', // Corrected path to .env file
      validationSchema: Joi.object({
        MONGODB_URI: Joi.string().required(),
      }),
    }),
    ClientsModule.registerAsync([
      {
        name: AUTH_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('AUTH_HOST'),
            port: configService.get('AUTH_PORT'),
          },
        }),
      },
      {
        name: PAYMENTS_SERVICE,
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
          transport: Transport.TCP,
          options: {
            host: configService.get('PAYMENTS_HOST'),
            port: configService.get('PAYMENTS_PORT'),
          },
        }),
      },
    ]),
  ],
  controllers: [ReservationsController],
  providers: [
    ReservationsService,
    ReservationsRepository,
    ConfigService,
    // JwtStrategy,
    // UsersService,
    // UsersRepository,
    // UserDocument,
    // JwtAuthGuard,
  ],
})
export class ReservationsModule {}
