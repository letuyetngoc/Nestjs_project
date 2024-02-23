import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schema/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';
import aqp from 'api-query-params';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }

  async create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const newCompany = await this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newCompany
  }

  async findAll(currentPage: number, limit: number, qs: string) {
    const { filter, sort, projection, population } = aqp(qs);
    delete filter.page
    const totalItems = (await this.companyModel.find(filter)).length
    const defaultLimit = limit ? limit : 10
    const totalPage = Math.ceil(totalItems / defaultLimit)
    const offset = ((currentPage - 1) * limit)

    const result = await this.companyModel.find(filter)
    .skip(offset)
    .limit(defaultLimit)
    .sort(sort as any)
    .select(projection)
    .populate(population)
    .exec()
    return {
      meta: {
        current: currentPage,
        pageSize: defaultLimit,
        total: totalPage
      },
      result
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  async update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return await this.companyModel.updateOne(
      { _id: id },
      {
        ...updateCompanyDto,
        updatedBy: {
          _id: user._id,
          email: user.email
        }
      }
    )
  }

  async remove(id: string, user: IUser) {
    await this.companyModel.updateOne(
      { _id: id }, {
      deletedBy: {
        _id: user._id,
        email: user.email
      }
    })
    return this.companyModel.softDelete({ _id: id })
  }
}
