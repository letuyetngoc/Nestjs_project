import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument } from 'mongoose';

export type CompanyDocument = HydratedDocument<Company>;

@Schema({timestamps: true })
export class Company {
    @Prop({required:true})
    name: string;

    @Prop({required:true})
    address: string;

    @Prop({required:true})
    description: string;

    @Prop({required:true})
    logo: string;

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deleteddAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop({type:Object})
    createdBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({type:Object})
    updatedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };

    @Prop({type:Object})
    deletedBy: {
        _id: mongoose.Schema.Types.ObjectId,
        email: string
    };
}

export const CompanySchema = SchemaFactory.createForClass(Company);
