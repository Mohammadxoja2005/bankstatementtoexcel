import { Module } from "@nestjs/common";
import { LanguageModelModule } from "app/infrastructure/language-model";
import { FileBuilderModule } from "app/infrastructure/file-builder/module";

@Module({
    imports: [LanguageModelModule, FileBuilderModule],
})
export class InfrastructureModule {}
