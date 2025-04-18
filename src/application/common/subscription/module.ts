import { Module } from "@nestjs/common";
import { SubscriptionController } from "app/application/api/controllers/subscription";

@Module({
    controllers: [SubscriptionController],
})
export class SubscriptionModule {}
