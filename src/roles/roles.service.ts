import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>
    ) { }

    //create a permission
    async create(createRoleDto: CreateRoleDto, user: IUser) {
        const permissionExist = await this.roleModel.findOne({ name: createRoleDto.name })
        if (permissionExist) {
            throw new BadRequestException("name role đã tồn tại")
        }
        const newPermission = await this.roleModel.create({
            ...createRoleDto,
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
}
