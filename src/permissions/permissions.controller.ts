import { Controller, Post, Body, Patch, Param } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UpdatePermissionDto } from './dto/update-permission.dto';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) { }

  @Post()
  @ResponseMessage('Create a new permission')
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user: IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

  @Patch(':id')
  @ResponseMessage('Update a new permission')
  update(
    @Body() updatePermissionDto: UpdatePermissionDto,
    @Param() id: string,
    @User() user: IUser) {
    return this.permissionsService.update(updatePermissionDto, user, id);
  }



}
