import { Module } from "@nestjs/common";
import { SubscriptionController } from "app/application/api/controllers/subscription";
import { SubscriptionActivateUseCase } from "app/application/usecases/subscription";
import { Application } from "app/common";
import { UserModule } from "app/application/common/user";

@Module({
    imports: [UserModule],
    providers: [
        {
            provide: Application.UseCase.Subscription.Activate,
            useClass: SubscriptionActivateUseCase,
        },
    ],
    controllers: [SubscriptionController],
    exports: [Application.UseCase.Subscription.Activate],
})
export class SubscriptionModule {}
