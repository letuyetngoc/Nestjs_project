import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Role, RoleDocument } from './schema/role.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';
import { UpdateRoleDto } from './dto/update-role.dto';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class RolesService {
    constructor(
        @InjectModel(Role.name)
        private roleModel: SoftDeleteModel<RoleDocument>
    ) { }

    //create a role
    async create(createRoleDto: CreateRoleDto, user: IUser) {
        const roleExist = await this.roleModel.findOne({ name: createRoleDto.name })
        if (roleExist) {
            throw new BadRequestException("name role đã tồn tại")
        }
        const newRole = await this.roleModel.create({
            ...createRoleDto,
            createdBy: {
                _id: user._id,
                email: user.email
            }
        })
        return {
            _id: newRole._id,
            createdAt: newRole.createdAt
        }
    }

    //update a role
    async update(updateRoleDto: UpdateRoleDto, user: IUser, id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException('not found role')
        }
        // const roleExist = await this.roleModel.findOne({ name: updateRoleDto.name })
        // if (roleExist) {
        //     throw new BadRequestException("name role đã tồn tại")
        // }
        return this.roleModel.updateOne({ ...updateRoleDto, updatedBy: { _id: user._id, email: user.email } })
    }

    //Fetch Roles with paginate
    async getAllRoles(current: number, pageSize: number, qs: string) {
        const { filter, sort, projection, population } = aqp(qs)

        delete filter.current
        delete filter.pageSize

        const defaultPageSize = pageSize ? pageSize : 10
        const offset = (current - 1) * defaultPageSize
        const totalItems = (await this.roleModel.find(filter)).length
        const totalPages = Math.ceil(totalItems / defaultPageSize)

        const result = await this.roleModel.find(filter)
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

    // Fetch Role by ID
    async getRoleById(id: string) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException('not found role')
        }
        return (await this.roleModel.findById(id)).populate({ path: 'permissions', select: { _id: 1, apiPath: 1, name: 1, method: 1, module: 1 } })
    }

    //delete a role
    async delete(id: string, user: IUser) {
        if (!mongoose.Types.ObjectId.isValid(id)) {
            throw new BadRequestException('not found role')
        }
        const foundUser = await this.roleModel.findById(id)
        if (foundUser.name === 'admin') {
            throw new BadRequestException('Không thể xoá role admin admin!')
        }
        await this.roleModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } })
        return this.roleModel.softDelete({ _id: id })
    }
}
