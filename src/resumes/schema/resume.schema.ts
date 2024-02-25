import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, SchemaTypes } from "mongoose";

export type ResumeDocument = HydratedDocument<Resume>;

@Schema({ timestamps: true })
export class Resume {
    @Prop()
    email: string;

    @Prop()
    userId: mongoose.Schema.Types.ObjectId;

    @Prop()
    url: string;

    @Prop()
    status: string;

    @Prop()
    companyId: mongoose.Schema.Types.ObjectId;

    @Prop()
    jobId: mongoose.Schema.Types.ObjectId;

    @Prop({ type: mongoose.Schema.Types.Array })
    history: {
        status: string;
        updatedAt: Date;
        updatedBy: {
            _id: mongoose.Schema.Types.ObjectId,
            email: string
        }
    }[]

    @Prop()
    createdAt: Date;

    @Prop()
    updatedAt: Date;

    @Prop()
    deleteddAt: Date;

    @Prop()
    isDeleted: boolean;

    @Prop({ type: Object })
    createdBy: { _id: mongoose.Schema.Types.ObjectId, email: string };

    @Prop({ type: Object })
    updatedBy: { _id: mongoose.Schema.Types.ObjectId, email: string };

    @Prop({ type: Object })
    deletedBy: { _id: mongoose.Schema.Types.ObjectId, email: string };
}

export const ResumeSchema = SchemaFactory.createForClass(Resume);