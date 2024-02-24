import { CreateJobsDto } from './create-jobs.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateUserDto extends CreateJobsDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    _id: string;
} 
