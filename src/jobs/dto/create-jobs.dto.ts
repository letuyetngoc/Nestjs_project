import { Type } from "class-transformer";
import { ArrayMinSize, IsArray, IsDateString, IsNotEmpty, IsNotEmptyObject, IsObject, IsString, ValidateNested } from "class-validator"
import mongoose from "mongoose";

class Company {
    @IsNotEmpty({ message: 'Id không được để trống' })
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string
}
export class CreateJobsDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Skills không được để trống' })
    @IsArray({ message: 'Skills có định dạng là array' })
    @ArrayMinSize(1)
    @IsString({ each: true, message:'Skill định dạng là string' })
    skills: string[];

    @IsNotEmpty({ message: 'Location không được để trống' })
    location: string;

    @IsNotEmpty({ message: 'Salary không được để trống' })
    salary: number

    @IsNotEmpty({ message: 'Quantity không được để trống' })
    quantity: string

    @IsNotEmpty({ message: 'Level không được để trống' })
    level: string

    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string

    @IsNotEmpty({ message: 'startDate không được để trống' })
    @IsDateString({}, { message: 'startDate có định dạng là Date' })
    startDate: Date

    @IsNotEmpty({ message: 'endDate không được để trống' })
    @IsDateString({}, { message: 'endDate có định dạng là Date' })
    endDate: Date

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}
// export class RegisterUserDTO {
//     @IsNotEmpty({ message: 'Name không được để trống' })
//     name: string;

//     @IsNotEmpty({ message: 'Email không được để trống' })
//     @IsEmail({}, { message: 'Email không đúng định dạng' })
//     email: string;

//     @IsNotEmpty({ message: 'Password không được để trống' })
//     password: string;

//     @IsNotEmpty({ message: 'Age không được để trống' })
//     age: number

//     @IsNotEmpty({ message: 'Gender không được để trống' })
//     gender: string

//     @IsNotEmpty({ message: 'Adress không được để trống' })
//     address: string
// }


