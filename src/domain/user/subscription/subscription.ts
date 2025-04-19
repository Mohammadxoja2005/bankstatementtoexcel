import { UserSubscriptionPlan } from "app/domain";

export type UserSubscription = {
    id: string | null;
    plan: UserSubscriptionPlan;
};
