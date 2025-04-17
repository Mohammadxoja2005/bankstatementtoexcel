import { Injectable } from "@nestjs/common";
import { PaymentProcessorStrategy, UserPlan } from "app/domain";
import axios from "axios";
import * as process from "node:process";

@Injectable()
export class PaymentProcessorLemonSqueezy implements PaymentProcessorStrategy {
    private readonly baseUrl = "https://api.lemonsqueezy.com/v1";

    public async createCheckoutLink(
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
    ): Promise<string> {
        const response = await axios.post(
            `${this.baseUrl}/checkouts`,
            {
                product_id: subscriptionInfo.product.id,
                email: subscriptionInfo.customer.email,
                metadata: metadata,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.LEMON_SQUEEZY_KEY}`,
                },
            },
        );

        return response.data.checkout_url;
    }
}
