import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type MongoUserDocument = HydratedDocument<MongoUser>;

@Schema({ timestamps: true })
export class MongoUser {
    @Prop({ required: true })
    name!: string;

    @Prop({ required: true })
    age!: number;

    @Prop({ required: true, unique: true })
    email!: string;

    @Prop({
        required: true,
        type: Number,
    })
    role_id!: number;

    @Prop({ required: true })
    password!: string;
}

export const MongoUserSchema = SchemaFactory.createForClass(MongoUser);
MongoUserSchema.index({ email: 1 }, { unique: true });
