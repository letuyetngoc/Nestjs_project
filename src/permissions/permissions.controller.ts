import { Controller, Post, Body } from '@nestjs/common';
import { PermissionsService } from './permissions.service';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { User } from 'src/decorator/customize';

@Controller('permissions')
export class PermissionsController {
  constructor(private readonly permissionsService: PermissionsService) {}

  @Post()
  create(@Body() createPermissionDto: CreatePermissionDto, @User() user:IUser) {
    return this.permissionsService.create(createPermissionDto, user);
  }

}
