import { Module } from "@nestjs/common";
import { Infrastructure } from "app/common";
import { FileBuilderExcel } from "app/infrastructure/file-builder";

@Module({
    providers: [
        {
            provide: Infrastructure.FileBuilder.Excel,
            useClass: FileBuilderExcel,
        },
    ],
    exports: [Infrastructure.FileBuilder.Excel],
})
export class FileBuilderModule {}
