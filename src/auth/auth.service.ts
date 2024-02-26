import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/users/schemas/user.interface';
import { RegisterUserDTO } from 'src/users/dto/create-user.dto';
import { ConfigService } from '@nestjs/config';
import ms from 'ms';
import { Response, Request } from 'express';
import { RolesService } from 'src/roles/roles.service';

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
        private configService: ConfigService,
        private rolesService: RolesService
    ) { }

    //username và pass là 2 tham số thư viện passport ném về
    async validateUser(username: string, pass: string): Promise<any> {
        const user = await this.usersService.findOneByUsername(username);
        if (user) {
            const isValidPassword = this.usersService.isValidPassword(pass, user.password)
            if (isValidPassword) {
                const userRole = user.role as unknown as { _id: string, name: string }
                const temp = await this.rolesService.getRoleById(userRole._id)
                return {
                    ...user.toObject(),
                    permissions: temp?.permissions || []
                };
            }
        }
        return null;
    }

    async login(user: IUser, response: Response) {
        const { _id, name, email, role, permissions } = user;
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
                role,
                permissions
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

                //fetch user'role
                const userRole = user.role as unknown as { _id: string, name: string }
                const temp = await this.rolesService.getRoleById(userRole._id)

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
                        role,
                        permissions: temp?.permissions ?? []
                    }
                };
            } else {
                throw new BadRequestException("refresh_token is not valid. Please login again!")
            }
        } catch (err) {
            throw new BadRequestException("refresh_token is not valid. Please login again!")
        }
    }

    async logout(user: IUser, response: Response) {
        await this.usersService.updateUserToken(null, user._id)
        response.clearCookie('refresh_token')
        return 'ok'
    }
}
