import { IsArray, IsInt, IsNotEmpty, IsString } from 'class-validator';

export class CreateRoleDTO {
    @IsString()
    @IsNotEmpty()
    name!: string;

    @IsString()
    description!: string;

    @IsArray()
    @IsInt({ each: true })
    permission_ids!: number[];
}
