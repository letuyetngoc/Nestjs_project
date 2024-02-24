import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/jobs.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { UpdateJobrDto } from './dto/update-jobs.dto';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }

  //create a new job
  create(createJobsDto: CreateJobsDto, user: IUser) {
    return this.jobModel.create({ ...createJobsDto, isActive: true, createdBy: { _id: user._id, email: user.email } })
  }

  //update a new job
  update(updateJobDto: UpdateJobrDto, user: IUser) {
    return this.jobModel.updateOne({ _id: updateJobDto._id }, { ...updateJobDto, updatedBy: { _id: user._id, email: user.email } })
  }
}
