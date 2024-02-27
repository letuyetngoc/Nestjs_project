import { IsArray, IsNotEmpty, IsString } from "class-validator";

export class CreateSubscriberDto {
    @IsNotEmpty({ message: 'Name không được để trống' })
    name: string;

    @IsNotEmpty({ message: 'Email không được để trống' })
    email: string;

    @IsNotEmpty({ message: 'Skills không được để trống' })
    @IsArray()
    @IsString({ each: true, message:'Skill định dạng là string' })
    skills: string[];
}
