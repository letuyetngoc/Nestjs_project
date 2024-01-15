import { Injectable } from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/user.schema';
import { Model, Types } from 'mongoose';
import { genSaltSync, hashSync } from 'bcryptjs';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {

  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>
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

  findAll() {
    return `This action returns all users`;
  }

  async findOne(id: string) {
    if (!Types.ObjectId.isValid(id)) return 'Not found user!'
    const newUser = await this.userModel.find({ _id: id })
    return newUser
  }

  async update(updateUserDto: UpdateUserDto) {
    return await this.userModel.updateOne({ _id: updateUserDto._id }, { ...updateUserDto });
  }

  async remove(id: string) {
    return this.userModel.deleteOne({ _id: id });
  }
}
