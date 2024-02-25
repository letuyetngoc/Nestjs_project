import { Controller, Post, Body, Patch, Delete, Param, Get, Query } from '@nestjs/common';
import { JobsService } from './jobs.service';
import { CreateJobsDto } from './dto/create-jobs.dto';
import { Public, ResponseMessage, User } from 'src/decorator/customize';
import { IUser } from 'src/users/schemas/user.interface';
import { UpdateJobrDto } from './dto/update-jobs.dto';

@Controller('jobs')
export class JobsController {
  constructor(private readonly jobsService: JobsService) { }

  @Post()
  @ResponseMessage('Create a job')
  async create(@Body() createJobsDto: CreateJobsDto, @User() user: IUser) {
    const newJob = await this.jobsService.create(createJobsDto, user);
    return { _id: newJob?._id, createdAt: newJob?.createdAt }
  }

  @Patch(':id')
  @ResponseMessage('Update a job')
  async update(@Body() updateJobDto: UpdateJobrDto, @User() user: IUser) {
    const jobUpdated = await this.jobsService.update(updateJobDto, user);
    return jobUpdated
  }

  @Delete(':id')
  @ResponseMessage('Delete a job')
  async delete(@Param('id') id: string, @User() user: IUser) {
    return await this.jobsService.delete(id, user);
  }

  @Public()
  @Get(':id')
  @ResponseMessage('Get a job')
  async getAJobById(@Param('id') id: string, @User() user: IUser) {
    return await this.jobsService.getAJobById(id, user);
  }

  @Public()
  @Get()
  @ResponseMessage('Get a job with pagination')
  async getJobsWithPagination(
    @Query('current') current: string,
    @Query('pageSize') pageSize: string,
    @Query() qs: string,
  ) {
    return await this.jobsService.getJobsWithPagination(+current, +pageSize, qs);
  }
}
