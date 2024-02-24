import { Controller, Post, UseGuards, Body, Res, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { RegisterUserDTO } from 'src/users/dto/create-user.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @ResponseMessage('Login success!')
  @Post('/login')
  async login(@User() user:IUser, @Res({ passthrough: true }) response: Response) {
    return this.authService.login(user, response);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Create user success!')
  register(@Body() user: RegisterUserDTO) {
    return this.authService.register(user)
  }

  @Get('/account')
  @ResponseMessage('Get user infomation')
  getInfoUser(@User() user: IUser){
    return user
  }

}
