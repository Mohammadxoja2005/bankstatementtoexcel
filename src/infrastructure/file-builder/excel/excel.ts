import { Injectable } from "@nestjs/common";
import * as xlsx from "xlsx";
import { BuildInput, BuildOutput } from "app/domain";
import * as process from "node:process";

@Injectable()
export class FileBuilderExcel {
    constructor() {}

    public build(input: BuildInput): BuildOutput {
        const worksheet = xlsx.utils.json_to_sheet(input.transactions);
        const keys = Object.keys(input.transactions[0]);

        worksheet["!cols"] = keys.map((key) => {
            const maxLength = Math.max(
                key.length,
                ...input.transactions.map((row) => row[key]?.toString().length || 0),
            );
            return { wch: maxLength + 2 };
        });

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, "Transactions");
        xlsx.writeFile(workbook, `${process.env.BASE_PATH}/tmp/${input.file.name}.xlsx`);

        return `${process.env.BASE_PATH}/tmp/${input.file.name}.xlsx`;
    }
}
