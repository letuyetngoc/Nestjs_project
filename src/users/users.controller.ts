import { Controller, Get, Post, Body, Patch, Param, Delete, Res, Query } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from './schemas/user.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) { }

  @Post()
  @ResponseMessage('Create user success!')
  async create(@Body() createUserDto: CreateUserDto, @User() user: IUser) {
    const newUser = await this.usersService.create(createUserDto, user);
    return { _id: newUser?._id, createdAt: newUser?.createdAt }
  }

  @Get()
  @ResponseMessage('Get user success!')
  findAll(
    @Query("page") page: string,
    @Query("limit") limit: string,
    @Query() qs: string
  ) {
    return this.usersService.findAll(+page, +limit, qs);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Get user success!')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @ResponseMessage('Update user success!')
  @Patch()
  async update(@Body() updateUserDto: UpdateUserDto, @User() user: IUser) {
    const userUpdated = await this.usersService.update(updateUserDto, user);
    return userUpdated
  }

  @ResponseMessage('Delete user success!')
  @Delete(':id')
  async remove(@Param('id') id: string, @User() user: IUser) {
    return await this.usersService.remove(id, user);
  }
}
