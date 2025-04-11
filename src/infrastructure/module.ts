import { Module } from "@nestjs/common";
import { LanguageModelModule } from "app/infrastructure/language-model";
import { FileBuilderModule } from "app/infrastructure/file-builder/module";
import { TextExtractorModule } from "app/infrastructure/text-extractor/module";

@Module({
    imports: [LanguageModelModule, FileBuilderModule, TextExtractorModule],
})
export class InfrastructureModule {}
