import { Inject, Injectable } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { LanguageModelNames, LanguageModelStrategy } from "app/domain";

@Injectable()
export class LanguageModelManager {
    constructor(
        @Inject(Infrastructure.LanguageModel.ChatGPT)
        private readonly languageModelChatGPT: LanguageModelStrategy,
    ) {}

    public setLanguageModel(model: LanguageModelNames): LanguageModelStrategy {
        if (model === LanguageModelNames.ChatGPT) {
            return this.languageModelChatGPT;
        }

        throw `Couldn't find language model: ${model}`;
    }
}
