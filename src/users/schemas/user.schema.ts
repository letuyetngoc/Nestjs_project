import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({required:true})
  name: string;

  @Prop({required:true})
  password: string;

  @Prop({required:true})
  email: string;

  @Prop()
  phone: string;

  @Prop()
  address: string;

  @Prop()
  createdAt: Date;

  @Prop()
  updatedAt: Date;

  @Prop()
  deleteddAt: Date;

  @Prop()
  isDeleted : boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
