import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schema/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';

@Injectable()
export class ResumesService {
    constructor(
        @InjectModel(Resume.name)
        private resumeModel: SoftDeleteModel<ResumeDocument>
    ) { }

    // create a resume
    async create(createResumeDto: CreateResumeDto, user: IUser) {
        return await this.resumeModel.create({
            email: user.email,
            userId: user._id,
            status: 'PENDING',
            history: [{
                    status: "PENDING",
                    updatedAt: new Date(),
                    updatedBy: {
                        _id: user._id,
                        email: user.email
                    }
                }],
            createdBy: {
                _id: user._id,
                email: user.email
            }

        });
    }

}
