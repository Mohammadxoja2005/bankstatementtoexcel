import { User, UserSubscriptionPlan } from "app/domain";

export interface UserRepository {
    create(user: Omit<User, "id">): Promise<void>;

    getById(id: string): Promise<User | null>;

    getByGoogleId: (id: string) => Promise<User>;

    updatePlan(user: {
        id: string;
        subscription: {
            id: string | null;
            plan: UserSubscriptionPlan;
        };
        limits: { pages: { available: number; max: number } };
    }): Promise<void>;
}
