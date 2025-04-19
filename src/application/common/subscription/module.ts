import { Module } from "@nestjs/common";
import { SubscriptionController } from "app/application/api/controllers/subscription";
import {
    SubscriptionActivateUseCase,
    SubscriptionDeactivateUseCase,
} from "app/application/usecases/subscription";
import { Application } from "app/common";
import { UserModule } from "app/application/common/user";

@Module({
    imports: [UserModule],
    providers: [
        {
            provide: Application.UseCase.Subscription.Activate,
            useClass: SubscriptionActivateUseCase,
        },
        {
            provide: Application.UseCase.Subscription.Deactivate,
            useClass: SubscriptionDeactivateUseCase,
        },
    ],
    controllers: [SubscriptionController],
    exports: [
        Application.UseCase.Subscription.Activate,
        Application.UseCase.Subscription.Deactivate,
    ],
})
export class SubscriptionModule {}
