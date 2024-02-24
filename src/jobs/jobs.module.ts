import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { Job, JobSchema } from './schemas/jobs.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { JobsService } from './jobs.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Job.name, schema: JobSchema }])],
  controllers: [JobsController],
  providers: [JobsService],
  exports:[JobsService],
})
export class JobsModule {}
