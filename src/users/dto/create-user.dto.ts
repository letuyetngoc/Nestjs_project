import { Type } from "class-transformer";
import { IsEmail, IsNotEmpty, IsNotEmptyObject, IsObject, ValidateNested } from "class-validator"
import mongoose from "mongoose";

class Company {
    @IsNotEmpty({ message: 'Id không được để trống' })
    _id: mongoose.Schema.Types.ObjectId

    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string
}
export class CreateUserDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;

    @IsNotEmpty({ message: 'Age không được để trống' })
    age: number

    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string

    @IsNotEmpty({ message: 'Adress không được để trống' })
    address: string

    @IsNotEmpty({ message: 'Role không được để trống' })
    role: string

    @IsNotEmptyObject()
    @IsObject()
    @ValidateNested()
    @Type(() => Company)
    company: Company;

}
export class RegisterUserDTO {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    @IsEmail({}, { message: 'Email không đúng định dạng' })
    email: string;

    @IsNotEmpty({ message: 'Password không được để trống' })
    password: string;

    @IsNotEmpty({ message: 'Age không được để trống' })
    age: number

    @IsNotEmpty({ message: 'Gender không được để trống' })
    gender: string

    @IsNotEmpty({ message: 'Adress không được để trống' })
    address: string

    @IsNotEmpty({ message: 'Role không được để trống' })
    role: string
}
