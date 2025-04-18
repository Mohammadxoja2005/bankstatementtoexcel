import { Module } from "@nestjs/common";
import { CheckoutController } from "app/application/api/controllers/checkout";
import { CheckoutCreateLinkUseCase } from "app/application/usecases/checkout/create-link";
import { PaymentProcessorModule } from "app/application/common/payment-processor";

@Module({
    imports: [PaymentProcessorModule],
    providers: [CheckoutCreateLinkUseCase],
    controllers: [CheckoutController],
})
export class CheckoutModule {}
