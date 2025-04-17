import { Injectable } from "@nestjs/common";
import { PaymentProcessorLemonSqueezy } from "../strategy";
import { PaymentProcessorNames } from "app/domain/payment-processor/strategy/types";

@Injectable()
export class PaymentProcessorManager {
    constructor(private readonly paymentProcessorLemonSqueezy: PaymentProcessorLemonSqueezy) {}

    public setPaymentProcessor(
        paymentProcessorName: PaymentProcessorNames,
    ): PaymentProcessorLemonSqueezy {
        if (paymentProcessorName === PaymentProcessorNames.LemonSqueezy) {
            return this.paymentProcessorLemonSqueezy;
        }

        throw new Error("Couldn't find payment processor", paymentProcessorName);
    }
}
