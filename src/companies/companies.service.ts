import { Injectable } from '@nestjs/common';
import { CreateCompanyDto } from './dto/create-company.dto';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Company, CompanyDocument } from './schema/company.schema';
import { SoftDeleteModel } from 'soft-delete-plugin-mongoose';
import { IUser } from 'src/users/schemas/user.interface';

@Injectable()
export class CompaniesService {

  constructor(
    @InjectModel(Company.name)
    private companyModel: SoftDeleteModel<CompanyDocument>
  ) { }

  create(createCompanyDto: CreateCompanyDto, user: IUser) {
    const newCompany = this.companyModel.create({
      ...createCompanyDto,
      createdBy: {
        _id: user._id,
        email: user.email
      }
    })
    return newCompany
  }

  findAll() {
    return `This action returns all companies`;
  }

  findOne(id: number) {
    return `This action returns a #${id} company`;
  }

  update(id: string, updateCompanyDto: UpdateCompanyDto, user: IUser) {
    return this.companyModel.updateOne(
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

  remove(id: number) {
    return `This action removes a #${id} company`;
  }
}
