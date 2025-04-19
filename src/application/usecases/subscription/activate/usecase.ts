import { Inject, Injectable } from "@nestjs/common";
import { UserPlan, UserRepository } from "app/domain";
import { Infrastructure } from "app/common";

@Injectable()
export class SubscriptionActivateUseCase {
    constructor(
        @Inject(Infrastructure.Repository.User)
        private readonly userRepository: UserRepository,
    ) {}

    public async execute(user: { id: string; plan: UserPlan }) {
        const foundUser = await this.userRepository.getById(user.id);

        if (!foundUser) {
            throw new Error("User not found");
        }

        if (user.plan === UserPlan.STARTER) {
            await this.updatePlanToStarter(user);
        }

        if (user.plan === UserPlan.PROFESSIONAL) {
            await this.updatePlanToProfessional(user);
        }

        if (user.plan === UserPlan.BUSINESS) {
            await this.updatePlanToBusiness(user);
        }
    }

    private async updatePlanToStarter(user: { id: string; plan: UserPlan }): Promise<void> {
        await this.userRepository.updatePlan({
            id: user.id,
            plan: user.plan,
            limits: {
                pages: {
                    available: 500,
                    max: 500,
                },
            },
        });
    }

    private async updatePlanToProfessional(user: { id: string; plan: UserPlan }): Promise<void> {
        await this.userRepository.updatePlan({
            id: user.id,
            plan: user.plan,
            limits: {
                pages: {
                    available: 2000,
                    max: 2000,
                },
            },
        });
    }

    private async updatePlanToBusiness(user: { id: string; plan: UserPlan }): Promise<void> {
        await this.userRepository.updatePlan({
            id: user.id,
            plan: user.plan,
            limits: {
                pages: {
                    available: 5000,
                    max: 5000,
                },
            },
        });
    }
}
