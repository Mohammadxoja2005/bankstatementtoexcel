import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { PaymentProcessorManager } from "app/infrastructure/payment-processor/manager";
import { PaymentProcessorNames } from "app/domain/payment-processor/strategy/types";
import { UserPlan } from "app/domain";

@Injectable()
export class CheckoutCreateLinkUseCase {
    constructor(
        @Inject(Infrastructure.PaymentProcessor.Manager)
        private readonly paymentProcessorManager: PaymentProcessorManager,
    ) {}

    public async execute(
        subscriptionInfo: {
            store: {
                id: number;
            };
            product: {
                id: number;
            };
            customer: {
                email: string;
                name: string;
            };
        },
        metadata: {
            userId: string;
            plan: UserPlan;
        },
    ): Promise<string> {
        try {
            const paymentProcessor = this.paymentProcessorManager.setPaymentProcessor(
                PaymentProcessorNames.LemonSqueezy,
            );

            return paymentProcessor.createCheckoutLink(subscriptionInfo, metadata);
        } catch (error) {
            throw new Error("Error creating checkout link", { cause: error });
        }
    }
}
