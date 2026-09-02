import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument, Types } from "mongoose";

export type PasswordResetTokenDocument = HydratedDocument<PasswordResetToken>;

@Schema({timestamps: true})
export class PasswordResetToken {
    @Prop({required: true, type: Types.ObjectId, ref: 'User'})
    user_id !: Types.ObjectId;

    @Prop({required:true, unique: true})
    token_hash !: string;

    @Prop({required: true})
    expires_at !: Date;

    @Prop({type: Date, default: null})
    used_at !: Date | null;
}

export const PasswordResetTokenSchema = SchemaFactory.createForClass(PasswordResetToken);