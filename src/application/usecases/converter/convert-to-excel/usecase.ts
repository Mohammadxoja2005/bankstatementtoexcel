import {Injectable} from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';
import * as mime from 'mime-types';
import * as process from 'node:process';
import * as xlsx from 'xlsx';
import {recognize} from 'tesseract.js';
import * as pdf from 'pdf-parse';

@Injectable()
export class ConvertToExcelUseCase {
    constructor() {
    }

    public async execute(input: any): Promise<any> {

    }

    public async processFile(filePath) {
        console.log('process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY);

        const mimeType = mime.lookup(filePath);
        const isPdf = mimeType === 'application/pdf';
        let text;
        let pages;

        if (isPdf) {
            pages = await this.extractPages(filePath);
            const dataBuffer = fs.readFileSync(filePath);

            const data = await pdf(dataBuffer);
            text = data.text;
            console.log("pages", pages.length);
        } else if (typeof mimeType === 'string' && mimeType.startsWith('image/')) {
            console.log('entered images');
            text = await this.extractTextFromImage(filePath);
        } else {
            throw new Error('Unsupported file type');
        }

        console.log("text1", text)
        const cleanedText = text.replace(/\s{2,}/g, ' ').trim();
        // console.log("cleanedText", cleanedText);

        const splittedText = this.splitIntoChunksByLines(cleanedText, 25);
        console.log("splittedText", splittedText.length);

        const response = await Promise.all(pages.map(chunk => this.sendToGPT(chunk)));
        // @ts-ignore
        const result = [];
        console.log("response1", response);
        for(const res of response) {
            // @ts-ignore
            console.log("res1", res);
            const arr = JSON.parse(res);
            console.log("arr", arr);
            // @ts-ignore
            result.push(...arr);
        }

        // const json = response.data.choices[0].message.content;

        // const cleaned = json.replace(/```json|```/g, '').trim();
        // console.log('cleaned', cleaned);
        // @ts-ignore
        const cleanedData = result;

        console.time('toconversion');
        const worksheet = xlsx.utils.json_to_sheet(cleanedData);

        const keys = Object.keys(cleanedData[0]);
        worksheet['!cols'] = keys.map(key => {
            const maxLength = Math.max(
                key.length,
                // @ts-ignore
                ...cleanedData.map(row => (row[key]?.toString().length || 0)),
            );
            return {wch: maxLength + 2};
        });

        const workbook = xlsx.utils.book_new();
        xlsx.utils.book_append_sheet(workbook, worksheet, 'Transactions');
        xlsx.writeFile(workbook, 'transactions.xlsx');
        console.timeEnd('toconversion');
    }

    private async extractPages(pdfPath: string): Promise<any> {
        const dataBuffer = fs.readFileSync(pdfPath);
        const options = {
            pagerender: async (pageData: any) => {
                return pageData.getTextContent().then((content: any) => {
                    const pageText = content.items
                        .map((item: any) => item.str)
                        .join('');

                    return pageText + '\n[[PAGE_BREAK]]';
                });
            }
        };

        const pdfData = await pdf(dataBuffer, options);
        console.log("pdf", pdfData);

        const textByPages = pdfData.text.split('[[PAGE_BREAK]]').filter(page => page.trim() !== '');

        console.log("textByPages", textByPages.length);

        return textByPages;
    }

    private splitIntoChunksByLines(text: string, maxLines: number = 25): string[] {
        console.log("entered lines");
        const lines = text.split('\n').filter(line => line.trim() !== '');
        const chunks: string[] = [];
        console.log("lines", lines);
        for (let i = 0; i < lines.length; i += maxLines) {
            const chunk = lines.slice(i, i + maxLines).join('\n');
            chunks.push(chunk);
        }
        fs.writeFile("chunks.txt", chunks.toString(), () => {
            console.log("chunks are saved")
        })
        return chunks;
    }

    private async sendToGPT(text: string) {
        const messages = [
            {
                role: 'user',
                content: [
                    {
                        type: 'text',
                        text: `You are a fast JSON transaction parser. Here is extracted text from image ${text}
                        You are a fast document parser. Extract transactions from text and return just JSON array with keys super fast no matter of text input: type, description, date, amount, currency, category.`,
                    },
                ],
            },
        ];

        console.time('chatgpt');
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-3.5-turbo',
            messages,
            max_tokens: 2000,
            temperature: 0,
        }, {
            headers: {
                Authorization: `Bearer`,
                'Content-Type': 'application/json',
            },
        });
        console.timeEnd('chatgpt');

        return response.data.choices[0].message.content
    }

    // private async extractPages(pdfPath: string) {
    // const loadingTask = pdfjsLib.getDocument(pdfPath);
    //     const doc = await loadingTask.promise;
    //     const pageCount = doc.numPages;
    //
    //     const allPages: string[] = [];
    //
    //     for (let i = 1; i <= pageCount; i++) {
    //         const page = await doc.getPage(i);
    //         const content = await page.getTextContent();
    //
    //         const pageText = content.items
    //             .map(item => {
    //                 if ('str' in item) {
    //                     return item.str;
    //                 }
    //                 return '';
    //             })
    //             .join(' ');
    //
    //         allPages.push(pageText);
    //     }
    //
    //     return allPages;
    // }

    private async extractTextFromImage(imagePath) {
        console.time(`ocr`);
        const {data: {text}} = await recognize(imagePath, 'eng', {
            logger: m => console.log(m.status),
        });
        console.timeEnd(`ocr`);
        return text;
    }
}

(async () => {
    console.time('overall');
    const filePath = process.argv[2];
    if (!filePath) {
        console.error('❌ Please provide a file path');
        process.exit(1);
    }
    const converter = new ConvertToExcelUseCase();
    try {
        await converter.processFile(filePath);
    } catch (err) {
        console.error('❌ Error:', err.message);
    }
    console.timeEnd('overall');
})();