import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) { }

  @Post()
  @ResponseMessage('Create a new resume')
  async create(@Body() createResumeDto: CreateResumeDto, @User() user: IUser) {
    const newResume = await this.resumesService.create(createResumeDto, user);
    return {
      _id: newResume._id,
      createdAt: newResume.createdAt
    }
  }

  @Get()
  @ResponseMessage('fetch all resumes with pagination')
  async getAllResumes(
    @Query('current') current: number,
    @Query('pageSize') pageSize: number,
    @Query() qs: string
  ) {
    return await this.resumesService.getAllResumes(+current, +pageSize, qs);
  }
}
