import { UserPlan } from "app/domain";

export interface PaymentProcessorStrategy {
    createCheckoutLink(
        subscriptionInfo: {
            product: {
                id: string;
            };
            customer: {
                email: string;
            };
        },
        metadata: {
            userId: string;
            plan: UserPlan;
        },
    ): Promise<string>;
}
