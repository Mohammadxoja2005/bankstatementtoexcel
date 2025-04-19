import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { UserPlan, UserRepository } from "app/domain";

@Injectable()
export class SubscriptionDeactivateUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(user: { id: string; plan: UserPlan }): Promise<void> {
        await this.userRepository.updatePlan({
            id: user.id,
            plan: user.plan,
            limits: {
                pages: {
                    available: 10,
                    max: 10,
                },
            },
        });
    }
}
