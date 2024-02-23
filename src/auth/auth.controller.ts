import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Public, ResponseMessage } from 'src/decorator/customize';
import { LocalAuthGuard } from './local-auth.guard';
import { JwtAuthGuard } from './jwt-auth.guard';
import { RegisterUserDTO } from 'src/users/dto/create-user.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService
  ) { }

  @Public()
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Public()
  @Post('/register')
  @ResponseMessage('Create user success!')
  register(@Body() user: RegisterUserDTO) {
    return this.authService.register(user)
  }

}
