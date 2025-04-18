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
                data: {
                    type: "checkouts",
                    attributes: {
                        store_id: 158685,
                        variant_id: 766751,
                        checkout_data: {
                            email: subscriptionInfo.customer.email,
                            custom: metadata,
                        },
                    },
                    relationships: {
                        store: {
                            data: {
                                id: "158685",
                                type: "stores",
                            },
                        },
                        variant: {
                            data: {
                                id: "766751",
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

        console.log("response", response.data.data.attributes);

        return response.data.data.attributes.url;
    }
}
