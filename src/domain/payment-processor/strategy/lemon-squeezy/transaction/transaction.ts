import { LemonSqueezyEvent, UserSubscriptionPlan } from "app/domain";

export type LemonSqueezyTransaction = {
    meta: {
        test_mode: boolean;
        event_name: LemonSqueezyEvent;
        custom_data: { plan: UserSubscriptionPlan; userId: string };
        webhook_id: string;
    };
    data: {
        type: string;
        id: string;
        attributes: {
            store_id: number;
            customer_id: number;
            order_id: number;
            order_item_id: number;
            product_id: number;
            variant_id: number;
            product_name: string;
            user_name: string;
            user_email: string;
        };
    };
};
