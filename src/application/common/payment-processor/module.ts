import { Module } from "@nestjs/common";
import { PaymentProcessorManager } from "app/infrastructure/payment-processor/manager";
import { PaymentProcessorLemonSqueezy } from "app/infrastructure/payment-processor/strategy";
import { Infrastructure } from "app/common";

@Module({
    providers: [
        {
            provide: Infrastructure.PaymentProcessor.Manager,
            useClass: PaymentProcessorManager,
        },
        PaymentProcessorLemonSqueezy,
    ],
    exports: [Infrastructure.PaymentProcessor.Manager],
})
export class PaymentProcessorModule {}
