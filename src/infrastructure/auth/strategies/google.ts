import { Injectable } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { Strategy, Profile } from "passport-google-oauth20";

@Injectable()
export class AuthGoogleStrategy extends PassportStrategy(Strategy, "google") {
    constructor() {
        super({
            clientID: process.env.GOOGLE_CLIENT_ID ?? " ",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? " ",
            callbackURL: process.env.CALLBACK_URL,
            scope: ["profile", "email"],
        });
    }

    public validate(_accessToken: string, _refreshToken: string, profile: Profile): Profile {
        return profile;
    }
}
