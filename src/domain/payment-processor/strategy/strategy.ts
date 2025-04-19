import { UserPlan } from "app/domain";

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
            plan: UserPlan;
        },
    ): Promise<string>;
}
