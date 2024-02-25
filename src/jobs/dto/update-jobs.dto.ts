import { CreateJobsDto } from './create-jobs.dto';
import { IsNotEmpty } from 'class-validator';

export class UpdateJobrDto extends CreateJobsDto {
    @IsNotEmpty({ message: 'id không được để trống' })
    _id: string;

    @IsNotEmpty({ message: 'isActive không được để trống' })
    isActive: boolean
} 
