import { Controller, Post, Body } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { ResponseMessage, User } from 'src/decorator/customize';

@Controller('resumes')
export class ResumesController {
  constructor(private readonly resumesService: ResumesService) {}

  @Post()
  @ResponseMessage('Create a new resume')
  async create(@Body() createResumeDto: CreateResumeDto, @User() user:IUser) {
    const newResume = await this.resumesService.create(createResumeDto, user);
    return {
      _id: newResume._id,
      createdAt: newResume.createdAt
    }
  }
}
