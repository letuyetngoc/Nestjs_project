import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import mongoose, { Types } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto, RegisterUserDTO } from './dto/create-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './schemas/user.interface';
import aqp from 'api-query-params';
import { Role, RoleDocument } from 'src/roles/schema/role.schema';
import { USER_ROLE } from 'src/databases/sample';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>,
    @InjectModel(Role.name)
    private roleModel: SoftDeleteModel<RoleDocument>,
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    //add logic check email
    const isExist = await this.userModel.findOne({ email: createUserDto.email })
    if (isExist) {
      throw new BadRequestException("Email already exists!")
    }
    //
    const hashPassword = this.getHashPassword(createUserDto.password)
    const newUser = await this.userModel.create({ ...createUserDto, password: hashPassword, createdBy: { _id: user._id, email: user.email } })
    return newUser
  }

  async register(registerUserDTO: RegisterUserDTO) {
    //add logic check email
    const isExist = await this.userModel.findOne({ email: registerUserDTO.email })
    if (isExist) {
      throw new BadRequestException("Email already exists!")
    }
    //

    //fetch user role
    const userRole = await this.roleModel.findOne({ name: USER_ROLE })

    const hashPassword = this.getHashPassword(registerUserDTO.password)
    const newUser = await this.userModel.create({ ...registerUserDTO, password: hashPassword, role: userRole._id })
    return newUser
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.current
    delete filter.pageSize

    const totalItems = (await this.userModel.find(filter)).length
    const defaultLimit = limit ? limit : 10
    const totalPage = Math.ceil(totalItems / defaultLimit)
    const offset = (currentPage - 1) * defaultLimit

    const result = await this.userModel.find(filter).select('-password')
      .skip(offset)
      .limit(defaultLimit)
      .sort(sort as any)
      .exec()

    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        pages: totalPage,
        total: totalItems
      },
      result
    }
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return 'Not found user!'
    const newUser = (await this.userModel.findOne({ _id: id }).select('-password')).populate({ path: 'role', select: { _id: 1, name: 1 } })
    return newUser
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    }).populate({ path: 'role', select: { name: 1 } })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto, updatedBy: { _id: user._id, email: user.email } });
  }

  async remove(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user'

    const foundUser = await this.userModel.findById(id)
    if (foundUser.email === 'admin@gmail.com') {
      throw new BadRequestException('Không thể xoá tài khoảng admin!')
    }

    await this.userModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } })
    return this.userModel.softDelete({ _id: id });
  }

  async updateUserToken(refreshToken: string, _id: string) {
    return await this.userModel.updateOne({ _id }, { refreshToken })
  }

  async findUserByRefreshToken(refreshToken: string) {
    const user = (await this.userModel.findOne({ refreshToken })).populate({
      path: 'role',
      select: { name: 1 }
    })
    return user
  }
}
