import { Module } from "@nestjs/common";
import { UserAuthenticateUseCase } from "app/application/usecases/user/authenticate";
import { UserController } from "app/application/api/controllers/user";
import { AuthModule } from "app/application/common/auth";
import { MongooseModule } from "app/application/common/mongoose";
import { UserRepositoryImpl } from "app/infrastructure/mongodb/user";
import { Infrastructure } from "app/common";
import { MongooseModule as Mongoose } from "@nestjs/mongoose";
import { Collections } from "app/infrastructure/schema";
import { UserSchema } from "app/infrastructure/mongodb/user/schema";

@Module({
    imports: [
        AuthModule,
        MongooseModule,
        Mongoose.forFeature([
            {
                name: Collections.User,
                schema: UserSchema,
            },
        ]),
    ],
    providers: [
        {
            provide: Infrastructure.Repository.User,
            useClass: UserRepositoryImpl,
        },
        UserAuthenticateUseCase,
    ],
    controllers: [UserController],
    exports: [Infrastructure.Repository.User],
})
export class UserModule {}
