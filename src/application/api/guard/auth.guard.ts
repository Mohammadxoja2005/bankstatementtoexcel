import { CanActivate, ExecutionContext, Injectable } from "@nestjs/common";
import { verify } from "jsonwebtoken";

@Injectable()
export class AuthGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean | Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.header("Token");

        try {
            const isValidToken = verify(token, `${process.env.JWT_SECRET_KEY}`);

            if (isValidToken) {
                return true;
            }
        } catch (error) {
            return false;
        }

        return false;
    }
}
