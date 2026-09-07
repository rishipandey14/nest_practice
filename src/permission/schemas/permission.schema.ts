import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";

export type PermissionDocument = HydratedDocument<Permission>;

@Schema({timestamps: true})
export class Permission {
    @Prop({
        required: true,
        unique: true,
    })
    id !: number;

    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    })
    key !: string;

    @Prop({
        required: true,
        trim: true,
    })
    Description !: string;
}

export const PermissionSchema = SchemaFactory.createForClass(Permission);
