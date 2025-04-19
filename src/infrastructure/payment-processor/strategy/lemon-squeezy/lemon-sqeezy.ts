import { Injectable } from "@nestjs/common";
import { PaymentProcessorStrategy, UserSubscriptionPlan } from "app/domain";
import axios from "axios";
import * as process from "node:process";

@Injectable()
export class PaymentProcessorLemonSqueezy implements PaymentProcessorStrategy {
    private readonly baseUrl = "https://api.lemonsqueezy.com/v1";

    public async createCheckoutLink(
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
    ): Promise<string> {
        const response = await axios.post(
            `${this.baseUrl}/checkouts`,
            {
                data: {
                    type: "checkouts",
                    attributes: {
                        store_id: subscriptionInfo.store.id,
                        variant_id: subscriptionInfo.product.id,
                        checkout_data: {
                            email: subscriptionInfo.customer.email,
                            name: subscriptionInfo.customer.name,
                            custom: metadata,
                        },
                    },
                    relationships: {
                        store: {
                            data: {
                                id: subscriptionInfo.store.id.toString(),
                                type: "stores",
                            },
                        },
                        variant: {
                            data: {
                                id: subscriptionInfo.product.id.toString(),
                                type: "variants",
                            },
                        },
                    },
                },
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.LEMON_SQUEEZY_KEY}`,
                },
                timeout: 10000,
            },
        );

        return response.data.data.attributes.url;
    }
}
