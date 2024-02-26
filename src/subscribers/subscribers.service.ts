import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateSubscriberDto } from './dto/create-subscriber.dto';
import { UpdateSubscriberDto } from './dto/update-subscriber.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Subscriber, SubscriberDocument } from './schema/subscriber.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class SubscribersService {
  constructor(
    @InjectModel(Subscriber.name)
    private subscriberModel: SoftDeleteModel<SubscriberDocument>
  ) { }

  // create a subscriber
  async create(createSubscriberDto: CreateSubscriberDto, user: IUser) {
    const subscriberExist = await this.subscriberModel.findOne({ email: createSubscriberDto.email })
    if (subscriberExist) {
      throw new BadRequestException("email đã tồn tại")
    }
    const newRole = await this.subscriberModel.create({
      ...createSubscriberDto,
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

  //update a subscriber
  async update(updateSubscriberDto: UpdateSubscriberDto, user: IUser, id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found subscriber')
    }
    
    return this.subscriberModel.updateOne({ ...updateSubscriberDto, updatedBy: { _id: user._id, email: user.email } })
  }

  //Fetch Roles with paginate
  async getAllRoles(current: number, pageSize: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs)

    delete filter.current
    delete filter.pageSize

    const defaultPageSize = pageSize ? pageSize : 10
    const offset = (current - 1) * defaultPageSize
    const totalItems = (await this.subscriberModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultPageSize)

    const result = await this.subscriberModel.find(filter)
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

  // Fetch subscriber by ID
  async getRoleById(id: string) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found subscriber')
    }
    return (await this.subscriberModel.findById(id))
  }

  //delete a subscriber
  async delete(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new BadRequestException('not found subscriber')
    }
    await this.subscriberModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } })
    return this.subscriberModel.softDelete({ _id: id })
  }
}
