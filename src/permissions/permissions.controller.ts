import { Controller, Post, Body, Patch, Param, Query, Get, Delete } from '@nestjs/common';
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

  @Get()
  @ResponseMessage('Fetch Permission with paginate')
  getAllPermissions(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string
  ) {
    return this.permissionsService.getAllPermissions(+current, +pageSize, qs);
  }

  @Get(':id')
  @ResponseMessage('Fetch Permission by ID')
  getPermissionById(@Param('id') id: string) {
    return this.permissionsService.getPermissionById(id);
  }

  @Delete(':id')
  @ResponseMessage('Delete a Permission')
  delete(@Param('id') id: string, @User() user: IUser) {
    return this.permissionsService.delete(id, user);
  }
}
