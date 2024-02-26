import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';
import mongoose from 'mongoose';

@Injectable()
export class PermissionsService {
  constructor(
    @InjectModel(Permission.name)
    private permissionModel: SoftDeleteModel<PermissionDocument>
  ) { }

  //create a permission
  async create(createPermissionDto: CreatePermissionDto, user: IUser) {
    const { apiPath, method } = createPermissionDto
    const permissionExist = await this.permissionModel.findOne({ apiPath, method })
    if (permissionExist) {
      throw new BadRequestException('permission đã tồn tại')
    }
    const newPermission = await this.permissionModel.create({
      ...createPermissionDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return {
      _id: newPermission._id,
      createdAt: newPermission.createdAt
    }
  }

  //update a permission
  async update(updatePermissionDto: UpdatePermissionDto, user: IUser, id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found permission')
    }
    return this.permissionModel.updateOne({ ...updatePermissionDto, updatedBy: { _id: user._id, email: user.email } })
  }
}
