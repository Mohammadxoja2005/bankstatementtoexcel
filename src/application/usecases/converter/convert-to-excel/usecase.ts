import { Injectable } from '@nestjs/common';
import * as fs from 'fs/promises';
import axios from 'axios';
import * as mime from 'mime-types';
import * as process from 'node:process';
import * as xlsx from 'xlsx';
import { recognize } from 'tesseract.js';
import * as pdf from 'pdf-parse';
import * as path from 'node:path';
import { File } from '../../../api/converter';

@Injectable()
export class ConvertToExcelUseCase {
  constructor() {}

  public async execute(input: { file: File }): Promise<any> {
    const fileName = `${Date.now()}-${input.file.originalname}`;

    const tempPath = path.join(
      '/home/muhammad/me/bankstatementtoexcel',
      'tmp',
      fileName,
    );

    await fs.writeFile(tempPath, input.file.buffer);

    const outputPath = await this.processFile(tempPath, fileName);

    await fs.unlink(tempPath);

    return outputPath;
  }

  public async processFile(
    filePath: string,
    fileName: string,
  ): Promise<string> {
    const mimeType = mime.lookup(filePath);
    let pages;

    if (mimeType === 'application/pdf') {
      pages = await this.extractPages(filePath);
    } else if (typeof mimeType === 'string' && mimeType.startsWith('image/')) {
      pages = await this.extractTextFromImage(filePath);
    } else {
      throw new Error('Unsupported application/pdfile type');
    }

    const response = await Promise.all(
      pages.map((chunk) => this.sendToGPT(chunk)),
    );
    // @ts-ignore
    const result = [];
    for (const res of response) {
      // @ts-ignore
      const arr = JSON.parse(res);
      // @ts-ignore
      result.push(...arr);
    }

    const worksheet = xlsx.utils.json_to_sheet(result);
    const keys = Object.keys(result[0]);
    worksheet['!cols'] = keys.map((key) => {
      const maxLength = Math.max(
        key.length,
        // @ts-ignore
        ...result.map((row) => row[key]?.toString().length || 0),
      );
      return { wch: maxLength + 2 };
    });

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    xlsx.writeFile(
      workbook,
      `/home/muhammad/me/bankstatementtoexcel/tmp/${fileName}.xlsx`,
    );
    console.timeEnd('toconversion');

    return `/home/muhammad/me/bankstatementtoexcel/tmp/${fileName}.xlsx`;
  }

  private async extractPages(pdfPath: string): Promise<any> {
    const dataBuffer = await fs.readFile(pdfPath);
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
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      },
    );

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
