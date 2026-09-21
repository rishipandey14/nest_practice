import { Module } from "@nestjs/common";
import { UserModule } from "src/user/user.module";
import { DatabaseAccessMiddleware } from "./middleware/databaseAccess.middleware";
import { RolesModule } from "src/roles/roles.module";
import { UserDbModule } from "src/userDbMapping/userDbMapping.module";



@Module({
    imports: [
        UserModule,
        RolesModule,
        UserDbModule,
    ],
    providers: [DatabaseAccessMiddleware],
    exports: [DatabaseAccessMiddleware]
})

export class DatabaseAccessModule {}
