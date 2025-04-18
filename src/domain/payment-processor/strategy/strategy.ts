import { UserSubscriptionPlan } from "app/domain";

export interface PaymentProcessorStrategy {
    createCheckoutLink(
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
            plan: UserSubscriptionPlan;
        },
    ): Promise<string>;
}
