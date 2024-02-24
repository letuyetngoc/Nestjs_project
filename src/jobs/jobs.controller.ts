import { Controller, Post, Body } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/schemas/user.interface';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage('Create a job')
  async create(@Body() createJobsDto: CreateJobsDto, @User() user: IUser) {
    const newJob = await this.jobsService.create(createJobsDto, user);
    return { _id: newJob?._id, createdAt: newJob?.createdAt }
  }

  
}
