import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'node:path';
import axios from 'axios';
import * as mime from 'mime-types';
import { promisify } from 'node:util';
import * as process from 'node:process';
import { fromPath } from 'pdf2pic';
import * as xlsx from 'xlsx';
import { recognize } from 'tesseract.js';
import * as pdf from 'pdf-parse';

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
      width: 1200,
    });

    return await convert(1);
  }

  public async processFile(filePath) {
    console.log('process.env.OPENAI_API_KEY', process.env.OPENAI_API_KEY);

    const mimeType = mime.lookup(filePath);
    const isPdf = mimeType === 'application/pdf';
    let text;

    if (isPdf) {
      const dataBuffer = fs.readFileSync(filePath);
      // console.log('Converting PDF to image(s)...');
      // images = await this.convertPDFtoImages(filePath);
      const data = await pdf(dataBuffer);
      text = data.text;
    } else if (typeof mimeType === 'string' && mimeType.startsWith('image/')) {
      console.log('entered images');
      text = await this.extractTextFromImage(filePath);
    } else {
      throw new Error('Unsupported file type');
    }

    // const readFile = promisify(fs.readFile);
    // const imageBuffers = await Promise.all(images.map(img => readFile(img, {encoding: 'base64'})));

    const cleanedText = text.replace(/\s{2,}/g, ' ').trim();
    console.log("cleanedText", cleanedText);
    const messages = [
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `You are a fast JSON transaction parser. Here is extracted text from image ${cleanedText}
                        You are a fast document parser. Extract transactions from text and return just JSON array with keys super fast no matter of text input: type, description, date, amount, currency, category.`,
          },
        ],
      },
    ];
    console.log("chatgpt message", messages[0].content);

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

    const json = response.data.choices[0].message.content;

    const cleaned = json.replace(/```json|```/g, '').trim();
    console.log('cleaned', cleaned);
    const cleanedData = JSON.parse(cleaned);

    console.time('toconversion');
    const worksheet = xlsx.utils.json_to_sheet(cleanedData);

    const keys = Object.keys(cleanedData[0]);
    worksheet['!cols'] = keys.map(key => {
      const maxLength = Math.max(
        key.length,
        ...cleanedData.map(row => (row[key]?.toString().length || 0)),
      );
      return { wch: maxLength + 2 };
    });

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Transactions');
    xlsx.writeFile(workbook, 'transactions.xlsx');
    console.timeEnd('toconversion');
  }

  private async extractTextFromImage(imagePath) {
    console.time(`ocr`);
    const { data: { text } } = await recognize(imagePath, 'eng', {
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