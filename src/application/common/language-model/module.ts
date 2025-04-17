import { Module } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { LanguageModelChatGPT } from "app/infrastructure/language-model/strategy";
import { LanguageModelManager } from "app/infrastructure/language-model/manager";

@Module({
    providers: [
        {
            provide: Infrastructure.LanguageModel.ChatGPT,
            useClass: LanguageModelChatGPT,
        },
        {
            provide: Infrastructure.LanguageModel.Manager,
            useClass: LanguageModelManager,
        },
    ],
    exports: [Infrastructure.LanguageModel.Manager],
})
export class LanguageModelModule {}
