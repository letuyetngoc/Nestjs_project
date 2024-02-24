import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/schemas/user.interface';
import { RegisterUserDTO } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response, Request } from 'express';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService
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

    async login(user: IUser, response: Response) {
        const { _id, name, email, role } = user;
        const payload = {
            sub: "token login",
            iss: "from server",
            _id,
            name,
            email,
            role
        };
        const refresh_token = this.createRefreshToken(payload)

        // update user with refresh token
        await this.usersService.updateUserToken(refresh_token, _id)

        //set refresh_token with cookie
        response.cookie('refresh_token', refresh_token, {
            httpOnly: true,
            maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
        })
        return {
            access_token: this.jwtService.sign(payload),
            user: {
                _id,
                name,
                email,
                role
            }
        };
    }

    async register(registerUserDTO: RegisterUserDTO) {
        const newUser = await this.usersService.register(registerUserDTO)
        return { _id: newUser._id, createdAt: newUser.createdAt }
    }

    createRefreshToken = (payload: any) => {
        const refreshToken = this.jwtService.sign(payload, {
            secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            expiresIn: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE')) / 1000
            //why /1000? ---- explain: ms ---> unit: ms; jwt: unit: s
        })
        return refreshToken
    }

    async handleRefreshToken(request: Request, response: Response) {
        //get refresh_token from cookie
        const refresh_token = request.cookies['refresh_token']

        try {
            this.jwtService.verify(refresh_token, {
                secret: this.configService.get<string>('JWT_REFRESH_TOKEN_SECRET'),
            })

            const user = await this.usersService.findUserByRefreshToken(refresh_token)

            if (user) {
                const { _id, name, email, role } = user;
                const payload = {
                    sub: "token refresh",
                    iss: "from server",
                    _id,
                    name,
                    email,
                    role
                };
                const refresh_token = this.createRefreshToken(payload)

                // update user with refresh token
                await this.usersService.updateUserToken(refresh_token, _id.toString())

                //set refresh_token with cookie
                response.cookie('refresh_token', refresh_token, {
                    httpOnly: true,
                    maxAge: ms(this.configService.get<string>('JWT_REFRESH_EXPIRE'))
                })
                return {
                    access_token: this.jwtService.sign(payload),
                    user: {
                        _id,
                        name,
                        email,
                        role
                    }
                };
            } else {
                throw new BadRequestException("refresh_token is not valid. Please login again!")
            }
        } catch (err) {
            throw new BadRequestException("refresh_token is not valid. Please login again!")
        }
    }
}
