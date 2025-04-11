import {Module} from "@nestjs/common";
import {LanguageModelModule} from "app/infrastructure/language-model";

@Module({
    imports: [LanguageModelModule]
})
export class InfrastructureModule {
}