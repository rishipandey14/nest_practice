import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from "mongoose";


export type userDbDocument = HydratedDocument<UserDb>;

@Schema({timestamps : true})
export class UserDb {
    @Prop({
        required: true,
        index: true
    })
    userId !: string;

    @Prop({
        required: true,
        enum: ["postgres", "mongodb"]
    })
    database !: "postgres" | "mongodb"
}

export const UserDbSchema = SchemaFactory.createForClass(UserDb);