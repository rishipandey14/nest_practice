import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Role } from '../user.types';

export type UserDocument = HydratedDocument<User>;

@Schema({timestamps: true})
export class User {
  @Prop({required: true})
  name!: string;

  @Prop({required: true})
  age!: number;

  @Prop({required: true, unique: true})
  email!: string;

  @Prop({
    required: true,
    type: Number,
  })
  role_id!: number;

  @Prop({required: true})
  password !: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
UserSchema.index({ email: 1 }, { unique: true });