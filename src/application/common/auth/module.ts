import { Module } from "@nestjs/common";
import { AuthGoogleStrategy } from "app/infrastructure/auth/strategies/google";

@Module({
    providers: [AuthGoogleStrategy],
})
export class AuthModule {}
