import { BadRequestException, Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Types } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto, RegisterUserDTO } from './dto/create-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from './schemas/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: SoftDeleteModel<UserDocument>
  ) { }

  getHashPassword = (password: string) => {
    const salt = genSaltSync(10);
    const hash = hashSync(password, salt);
    return hash
  }

  async create(createUserDto: CreateUserDto, user: IUser) {
    const hashPassword = this.getHashPassword(createUserDto.password)
    const newUser = await this.userModel.create({ ...createUserDto, password: hashPassword, createdBy: { _id: user._id, email: user.email } })
    return { _id: newUser._id, createdAt: newUser.createdAt }
  }

  async register(registerUserDTO: RegisterUserDTO) {
    const hashPassword = this.getHashPassword(registerUserDTO.password)
    //add logic check email
    const isExist = await this.userModel.findOne({ email: registerUserDTO.email })
    if(isExist){
      throw new BadRequestException("Email already exists!")
    }
    //
    const newUser = await this.userModel.create({ ...registerUserDTO, password: hashPassword, role: 'USER' })
    return newUser
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort } = aqp(qs);
    delete filter.page

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
        total: totalPage
      },
      result
    }
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return 'Not found user!'
    const newUser = await this.userModel.find({ _id: id }).select('-password')
    return newUser[0]
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }

  isValidPassword(password: string, hash: string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto, user: IUser) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto, updatedBy: { _id: user._id, email: user.email } });
  }

  async remove(id: string, user: IUser) {
    await this.userModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } })
    return this.userModel.softDelete({ _id: id });
  }
}
