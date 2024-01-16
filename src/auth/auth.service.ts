import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService
    ) { }

    //username và pass là 2 tham số thư viện passport ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValidPassword = this.usersService.isValidPassword(pass, user.password)
            if (isValidPassword) {
                return user;
            }
        }
        return null;
    }

    async login(user: any) {
        const payload = { sub: user._id, username: user.email };
        return {
            access_token: await this.jwtService.signAsync(payload),
        };
    }
}
