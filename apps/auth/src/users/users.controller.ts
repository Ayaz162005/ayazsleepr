import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser } from '../../../../libs/common/src/decorators/current-user.decorator';
import { UserDocument } from '../../../../libs/common/src/models/user.schema';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}
  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    console.log('posososos');
    return this.usersService.create(createUserDto);
  }
  @Get()
  @UseGuards(JwtAuthGuard)
  async getuser(@CurrentUser() user: UserDocument) {
    console.log(user, 'hjjj');
    return user;
  }
}
