import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { RolesService } from './roles.service';
import { CreateRoleDto } from './dto/create-role.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/schemas/user.interface';
import { UpdateRoleDto } from './dto/update-role.dto';

@Controller('roles')
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}
  @Post()
  @ResponseMessage('Create a new Role')
  create(@Body() createRoleDto: CreateRoleDto, @User() user: IUser) {
    return this.rolesService.create(createRoleDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Update a role')
  update(
    @Body() updateRolesDto: UpdateRoleDto,
    @Param() id: string,
    @User() user: IUser) {
    return this.rolesService.update(updateRolesDto, user, id);
  }
  
}
