import { Schema } from "mongoose";
import { UserHydratedDocument } from "./document";
import { Collections } from "app/infrastructure/schema";

export const UserSchema = new Schema<UserHydratedDocument>(
    {
        name: String,
        email: String,
        is_active: Boolean,
        oauth: {
            google_id: String,
        },
        limits: {
            pages: {
                available: Number,
                max: Number,
            },
        },
        subscription: {
            id: { type: String, default: null },
            plan: String,
        },
    },
    {
        timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
        versionKey: false,
        collection: Collections.User,
    },
);
