import { Injectable } from '@nestjs/common';
import { CreateResumeDto } from './dto/create-resume.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Resume, ResumeDocument } from './schema/resume.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';
import aqp from 'api-query-params';

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

    //fetch all resumes with pagination
    async getAllResumes(current: number, pageSize: number, qs: string) {
        const { filter, sort } = aqp(qs);
        delete filter.current
        delete filter.pageSize

        const defaultPageSize = pageSize ? pageSize : 10
        const totalItems = Math.ceil((await this.resumeModel.find(filter )).length)
        const totalPages = Math.ceil(totalItems / defaultPageSize)
        const offset = (current - 1) * defaultPageSize

        const result = await this.resumeModel.find(filter)
            .skip(offset)
            .limit(defaultPageSize)
            .sort(sort as any)
            .exec()

        return {
            meta: {
                current,
                pageSize,
                pages: totalPages,
                total: totalItems
            },
            result
        }

    }
}
