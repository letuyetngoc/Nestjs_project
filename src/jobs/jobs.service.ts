import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Job, JobDocument } from './schemas/jobs.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { IUser } from 'src/users/schemas/user.interface';

@Injectable()
export class JobsService {
  constructor(
    @InjectModel(Job.name)
    private jobModel: SoftDeleteModel<JobDocument>
  ) { }

  //create a new job
  create(createJobsDto: CreateJobsDto, user: IUser) {
    return this.jobModel.create({ ...createJobsDto, createdBy: { _id: user._id, email: user.email } })
  }
  //
}
