import { IsArray, IsInt, IsNotEmpty, IsOptional, IsString } from "class-validator";



export class UpdateRoleDTO {
    
    @IsString()
    @IsOptional()
    name ?: string;

    @IsString()
    @IsOptional()
    description ?: string;
    
    @IsArray()
    @IsOptional()
    @IsInt({each: true})
    permission_ids ?: number[];
}
