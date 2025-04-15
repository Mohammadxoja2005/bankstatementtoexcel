import { HydratedDocument, Types } from "mongoose";
import { UserPlan } from "app/domain";

export type UserDocument = {
    id: Types.ObjectId;
    name: string | null;
    email: string | null;
    is_active: boolean;
    oauth: {
        google_id: string;
    };
    limits: {
        pages: {
            available: number;
            max: number;
        };
    };
    plan: UserPlan;
    created_at: string;
    updated_at: string;
};

export type UserCreateDocument = Omit<UserDocument, "id" | "created_at" | "updated_at">;

export type UserHydratedDocument = HydratedDocument<UserDocument>;
