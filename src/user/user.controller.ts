/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post('signIn')
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }
  @Post('login')
  login(@Body() LoginDto: LoginUserDto) {
    return this.userService.login(LoginDto);
  }

  @UseGuards(AuthGuard)
  @Get('allUser')
  findAll() {
    return this.userService.findAll();
  }
}
