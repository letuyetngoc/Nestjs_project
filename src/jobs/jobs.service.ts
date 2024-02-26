import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/jobs.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { UpdateJobrDto } from './dto/update-jobs.dto';
import mongoose from 'mongoose';
import aqp from 'api-query-params';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }

  //create a new job
  async create(createJobsDto: CreateJobsDto, user: IUser) {
    return await this.jobModel.create({ ...createJobsDto, isActive: true, createdBy: { _id: user._id, email: user.email } })
  }

  //update a job
  async update(updateJobDto: UpdateJobrDto, user: IUser) {
    return await this.jobModel.updateOne({ _id: updateJobDto._id }, { ...updateJobDto, updatedBy: { _id: user._id, email: user.email } })
  }

  //delete a job
  async delete(id: string, user: IUser) {
    if (!mongoose.Types.ObjectId.isValid(id)) return 'not found user'
    await this.jobModel.updateOne({ _id: id }, { deletedBy: { _id: user._id, email: user.email } })
    return this.jobModel.softDelete({ _id: id });
  }

  //get a job by id
  async getAJobById(id: string, user: IUser) {
    return this.jobModel.findOne({ _id: id })
  }

  //get jobs with pagination
  async getJobsWithPagination(current: number, pageSize: number, qs: string) {
    const { filter, sort } = aqp(qs)

    delete filter.current
    delete filter.pageSize

    const defaultPageSize = pageSize ? pageSize : 10
    const offset = (current - 1) * defaultPageSize
    const totalItems = (await this.jobModel.find(filter)).length
    const totalPages = Math.ceil(totalItems / defaultPageSize)

    const result = await this.jobModel.find(filter)
      .skip(offset)
      .limit(defaultPageSize)
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
}
