import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import * as dotenv from "dotenv";
import * as process from "node:process";

async function bootstrap() {
    dotenv.config();
    const app = await NestFactory.create(AppModule, {
        rawBody: true,
    });

    await app.listen(process.env.PORT ?? 3001);
}

bootstrap();
