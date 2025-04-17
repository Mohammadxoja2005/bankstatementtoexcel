import { Module } from "@nestjs/common";
import { UserAuthenticateUseCase } from "app/application/usecases/user/authenticate";
import { UserController } from "app/application/api/controllers/user";
import { AuthModule } from "app/application/common/auth";

@Module({
    imports: [AuthModule],
    providers: [UserAuthenticateUseCase],
    controllers: [UserController],
})
export class UserModule {}
