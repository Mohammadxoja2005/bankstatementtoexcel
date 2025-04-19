import { UserSubscription } from "app/domain";

export type User = {
    id: string;
    name: string | null;
    email: string | null;
    isActive: boolean;
    oauth: {
        googleId: string;
    };
    limits: {
        pages: {
            available: number;
            max: number;
        };
    };
    subscription: UserSubscription;
};
