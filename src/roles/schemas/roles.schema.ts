import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type RolesDocument = HydratedDocument<Roles>;

@Schema({ timestamps: true })
export class Roles {
    @Prop({
        required: true,
        unique: true,
    })
    id!: number;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    })
    name!: string;

    @Prop({
        default: '',
        trim: true,
    })
    description!: string;

    @Prop({
        type: [Number],
        default: [],
    })
    permission_ids!: number[];

    @Prop({
        default: false,
    })
    isSystemRole!: boolean;
}

export const RolesSchema = SchemaFactory.createForClass(Roles);
