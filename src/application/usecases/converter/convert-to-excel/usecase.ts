import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import axios from 'axios';
import * as mime from 'mime-types';
import * as process from 'node:process';
import * as xlsx from 'xlsx';
import { recognize } from 'tesseract.js';
import * as pdf from 'pdf-parse';

@Injectable()
export class ConvertToExcelUseCase {
  constructor() {}

  public async execute(input: any): Promise<any> {}

  public async processFile(filePath) {
    const mimeType = mime.lookup(filePath);
    const isPdf = mimeType === 'application/pdf';
    let pages;

    if (isPdf) {
      pages = await this.extractPages(filePath);
    } else if (typeof mimeType === 'string' && mimeType.startsWith('image/')) {
      pages = await this.extractTextFromImage(filePath);
    } else {
      throw new Error('Unsupported file type');
    }

    const response = await Promise.all(
      pages.map((chunk) => this.sendToGPT(chunk)),
    );
    // @ts-ignore
    const result = [];
    console.log('response1', response);
    for (const res of response) {
      // @ts-ignore
      console.log('res1', res);
      const arr = JSON.parse(res);
      console.log('arr', arr);
      // @ts-ignore
      result.push(...arr);
    }

    const cleanedData = result;

    console.time('toconversion');
    const worksheet = xlsx.utils.json_to_sheet(cleanedData);

    const keys = Object.keys(cleanedData[0]);
    worksheet['!cols'] = keys.map((key) => {
      const maxLength = Math.max(
        key.length,
        // @ts-ignore
        ...cleanedData.map((row) => row[key]?.toString().length || 0),
      );
      return { wch: maxLength + 2 };
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
          const pageText = content.items.map((item: any) => item.str).join('');

          return pageText + '\n[[PAGE_BREAK]]';
        });
      },
    };

    const parsedPDF = await pdf(dataBuffer, options);

    return parsedPDF.text
      .split('[[PAGE_BREAK]]')
      .filter((page) => page.trim() !== '');
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
    const response = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-3.5-turbo',
        messages,
        max_tokens: 2000,
        temperature: 0,
      },
      {
        headers: {
          Authorization: `Bearer`,
          'Content-Type': 'application/json',
        },
      },
    );
    console.timeEnd('chatgpt');

    return response.data.choices[0].message.content;
  }

  private async extractTextFromImage(imagePath) {
    const {
      data: { text },
    } = await recognize(imagePath, 'eng', {
      logger: (m) => console.log(m.status),
    });

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
