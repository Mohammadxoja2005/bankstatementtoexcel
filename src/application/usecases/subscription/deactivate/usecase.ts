import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { UserSubscriptionPlan, UserRepository } from "app/domain";

@Injectable()
export class SubscriptionDeactivateUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(user: {
        id: string;
        subscription: {
            id: null;
            plan: UserSubscriptionPlan;
        };
    }): Promise<void> {
        await this.userRepository.updatePlan({
            id: user.id,
            subscription: user.subscription,
            limits: {
                pages: {
                    available: 10,
                    max: 10,
                },
            },
        });
    }
}
