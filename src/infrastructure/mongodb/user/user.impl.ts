import { Injectable, NotFoundException } from "@nestjs/common";
import { User, UserRepository, UserSubscriptionPlan } from "app/domain";
import { Model, Types } from "mongoose";
import { Collections } from "app/infrastructure/schema";
import { UserCreateDocument, UserDocument, UserHydratedDocument } from "./document";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class UserRepositoryImpl implements UserRepository {
    constructor(
        @InjectModel(Collections.User)
        private readonly model: Model<UserHydratedDocument>,
    ) {}

    public async create(user: User): Promise<void> {
        const isUserExists = await this.model.findOne<UserDocument>({
            "oauth.google_id": user.oauth.googleId,
        });

        if (isUserExists) {
            return;
        }

        await this.model.create<UserCreateDocument>({
            name: user.name,
            email: user.email,
            is_active: user.isActive,
            oauth: {
                google_id: user.oauth.googleId,
            },
            limits: {
                pages: {
                    available: user.limits.pages.available,
                    max: user.limits.pages.max,
                },
            },
            subscription: {
                id: null,
                plan: user.subscription.plan,
            },
        });
    }

    public async getByGoogleId(id: string): Promise<User> {
        const document = await this.model.findOne<UserDocument>({ "oauth.google_id": id });

        if (!document) {
            throw new NotFoundException("User not found");
        }

        return this.documentToEntity(document);
    }

    public async getById(id: string): Promise<User> {
        const document = await this.model.findOne({ _id: new Types.ObjectId(id) });

        if (!document) {
            throw new Error("User not found");
        }

        return this.documentToEntity(document);
    }

    public async updatePlan(user: {
        id: string;
        subscription: {
            id: string | null;
            plan: UserSubscriptionPlan;
        };
        limits: { pages: { available: number; max: number } };
    }): Promise<void> {
        await this.model.updateOne(
            { _id: new Types.ObjectId(user.id) },
            {
                subscription: user.subscription,
                "limits.pages": user.limits.pages,
            },
        );
    }

    private documentToEntity(document: UserDocument): User {
        return {
            id: document._id.toString(),
            name: document.name,
            email: document.email,
            isActive: document.is_active,
            oauth: {
                googleId: document.oauth.google_id,
            },
            limits: {
                pages: {
                    available: document.limits.pages.available,
                    max: document.limits.pages.max,
                },
            },
            subscription: {
                id: document.subscription.id,
                plan: document.subscription.plan,
            },
        };
    }
}
