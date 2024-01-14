import { Controller, Get, Post, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth-guard';
import { CurrentUser } from '../../../libs/common/src/decorators/current-user.decorator';
import { UserDocument } from '../../../libs/common/src/models/user.schema';
import { Response } from 'express';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { JwtAuthGuard } from './guards/jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(
    @CurrentUser() user: UserDocument,
    @Res({ passthrough: true }) response: Response,
  ) {
    await this.authService.login(user, response);
    response.send(user);
  }
  @UseGuards(JwtAuthGuard)
  @MessagePattern('authendicate')
  async authentications(@Payload() data: any) {
    console.log('dkdkdkdkdk');
    console.log('authentications', data);
    return data.user;
  }
}
