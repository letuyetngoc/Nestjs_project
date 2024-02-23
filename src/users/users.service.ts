import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { genSaltSync, hashSync, compareSync } from 'bcryptjs';
import { CreateUserDto, RegisterUserDTO } from './dto/create-user.dto';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';

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

  async create(createUserDto: CreateUserDto) {
    const { name, email, password } = createUserDto
    const hashPassword = this.getHashPassword(password)
    const newUser = await this.userModel.create({
      name, password: hashPassword, email
    })
    return newUser
  }

  async register(registerUserDTO: RegisterUserDTO) {
    const hashPassword = this.getHashPassword(registerUserDTO.password)
    const newUser = await this.userModel.create({ ...registerUserDTO, password: hashPassword, role: 'USER' })
    return {_id: newUser._id, createdAt:newUser.createdAt}
  }

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return 'Not found user!'
    const newUser = await this.userModel.find({ _id: id })
    return newUser
  }

  findOneByUsername(username: string) {
    return this.userModel.findOne({
      email: username
    })
  }

  isValidPassword(password:string, hash:string) {
    return compareSync(password, hash);
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(id: string) {
    return this.userModel.softDelete({ _id: id });
  }
}
