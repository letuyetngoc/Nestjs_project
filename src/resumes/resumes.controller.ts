import { Controller, Post, Body, Get, Query, Param, Patch, Delete } from '@nestjs/common';
import { ResumesService } from './resumes.service';
import { CreateResumeDto } from './dto/create-resume.dto';
import { IUser } from 'src/users/schemas/user.interface';
import { ResponseMessage, User } from 'src/decorator/customize';
import { UpdateResumeDto } from './dto/update-resume.dto';

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

  @Get(':id')
  @ResponseMessage('fetch resume by id')
  async getResumebyId(@Param('id') id: string) {
    return await this.resumesService.getResumebyId(id);
  }

  @Patch(':id')
  @ResponseMessage('update status of resume')
  async updateResume(
    @Param('id') id: string,
    @Body() updateResumeDto: UpdateResumeDto,
    @User() user:IUser
  ) {
    return await this.resumesService.updateResume(id, updateResumeDto, user);
  }

  @Delete(':id')
  @ResponseMessage('delete a resume')
  async deleteResume(@Param('id') id: string, @User() user:IUser) {
    return await this.resumesService.deleteResume(id, user);
  }

  @Post('by-user')
  @ResponseMessage('get CV by user')
  async getResumeByUser(@User() user: IUser) {
    return await this.resumesService.getResumesByUser(user);
  }
}
