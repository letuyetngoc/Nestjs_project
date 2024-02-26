import { IsArray, IsMongoId, IsNotEmpty } from "class-validator"
import mongoose from "mongoose";

export class CreateRoleDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Description không được để trống' })
    description: string;

    @IsNotEmpty({ message: 'IsActive không được để trống' })
    isActive: boolean;

    @IsNotEmpty({ message: 'Permissions không được để trống' })
    @IsArray({ message: 'Permissions có định dạng là array' })
    @IsMongoId({ each: true, message: 'Each permission định dạng là mongoId' })
    permissions:  mongoose.Types.ObjectId[];
}
