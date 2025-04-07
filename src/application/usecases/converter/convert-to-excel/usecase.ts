import {Injectable} from "@nestjs/common";
import * as fs from "fs";
import * as path from "node:path";
import axios from "axios";
import * as mime from "mime-types";
import {promisify} from "node:util";
import * as process from "node:process";
import {fromPath} from "pdf2pic";
import * as xlsx from "xlsx";

@Injectable()
export class ConvertToExcelUseCase {
    constructor() {
    }

    public async execute(input: any): Promise<any> {

    }

    private async convertPDFtoImages(pdfPath): Promise<any> {
        const outputDir = path.dirname(pdfPath);
        const outputFileBase = path.join(outputDir, 'converted');

        const convert = fromPath(pdfPath, {
            density: 300,
            savePath: './output',
            format: 'jpeg',
            width: 1200
        });

        return await convert(1);
    }

    public async processFile(filePath) {
        console.log("process.env.OPENAI_API_KEY", process.env.OPENAI_API_KEY);

        const mimeType = mime.lookup(filePath);
        const isPdf = mimeType === 'application/pdf';
        let images = [];

        if (isPdf) {
            console.log('Converting PDF to image(s)...');
            images = await this.convertPDFtoImages(filePath);
        }
        if (typeof mimeType === 'string' && mimeType.startsWith('image/')) {
            console.log("entered images");
            images = [filePath] as never;
        } else {
            throw new Error('Unsupported file type');
        }

        const readFile = promisify(fs.readFile);
        const imageBuffers = await Promise.all(images.map(img => readFile(img, {encoding: 'base64'})));

        const messages = [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `You are a document parser. Extract all transaction records from the following bank statement images and return them as JSON in array without any extra words so that it will be available to parse immediately.

Each transaction should have the following fields:
- Type
- Description
- Tran Date
- Date Paid
- Date Credited
- Check Number
- Amount
- Reference Number
- Account Holder Name (if available)
- Account Number (if available)
- Transaction Category
- Running Balance
- Transaction Fee (if applicable)
- Currency
- Transaction Status (Pending, Cleared, etc.)
- Vendor or Payee Information (for checks or transfers)
- Tax-related Data (if applicable)
- Notes/Comments (optional)

Return only a JSON array of transactions. No explanation!!!`
                    },
                    ...imageBuffers.map(base64 => ({
                        type: 'image_url',
                        image_url: {url: `data:image/png;base64,${base64}`}
                    }))
                ]
            }
        ];

        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4o-mini',
            messages,
            max_tokens: 2000
        }, {
            headers: {
                Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        const json = response.data.choices[0].message.content;

        const cleaned = json.replace(/```json|```/g, '').trim();

        const cleanedData =  JSON.parse(cleaned);

        const worksheet = xlsx.utils.json_to_sheet(cleanedData);

        const keys = Object.keys(cleanedData[0]);
        worksheet['!cols'] = keys.map(key => {
            const maxLength = Math.max(
                key.length,
                ...cleanedData.map(row => (row[key]?.toString().length || 0))
            );
            return { wch: maxLength + 2 };
        });

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        xlsx.writeFile(workbook, 'transactions.xlsx');
    }
}

// (async () => {
//     const filePath = process.argv[2];
//     if (!filePath) {
//         console.error('❌ Please provide a file path');
//         process.exit(1);
//     }
//     const converter = new ConvertToExcelUseCase();
//     try {
//         await converter.processFile(filePath);
//     } catch (err) {
//         console.error('❌ Error:', err.message);
//     }
// })();