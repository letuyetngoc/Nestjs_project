import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePermissionDto } from './dto/create-permission.dto';
import { UpdatePermissionDto } from './dto/update-permission.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Permission, PermissionDocument } from './schema/permission.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

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

  //Fetch Permission with paginate
  async getAllPermissions(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs)

    delete filter.current
    delete filter.pageSize

    const defaultPageSize = pageSize ? pageSize : 10
    const offset = (current - 1) * defaultPageSize
    const totalItems = (await this.permissionModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultPageSize)

    const result = await this.permissionModel.find(filter)
      .skip(offset)
      .limit(defaultPageSize)
      .select(projection)
      .populate(population)
      .sort(sort as any)
      .exec()

    return {
      meta: {
        current,
        pageSize,
        pages: totalPages,
        total: totalItems
      },
      result
    }
  }

  // Fetch Permission by ID
  async getPermissionById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found permission')
    }
    return this.permissionModel.findById(id)
  }

  //delete a permission
  async delete(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found permission')
    }
    await this.permissionModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } })
    return this.permissionModel.softDelete({_id: id})
  }
}
