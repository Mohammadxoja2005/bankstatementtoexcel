import { Injectable } from "@nestjs/common";
import axios from "axios";
import * as process from "node:process";
import { LanguageModelStrategy } from "app/domain";

@Injectable()
export class LanguageModelChatGPT implements LanguageModelStrategy {
    public async extractTransactionsFromText(text: string): Promise<string> {
        const messages = [
            {
                role: "user",
                content: [
                    {
                        type: "text",
                        text: `You are a fast JSON transaction parser. Here is extracted text from image ${text}
                        You are a fast document parser. Extract transactions from text and return just JSON array with keys super fast no matter of text input: type, description, date, amount, currency, category.`,
                    },
                ],
            },
        ];

        const response = await axios.post(
            "https://api.openai.com/v1/chat/completions",
            {
                model: "gpt-3.5-turbo",
                messages,
                max_tokens: 2000,
                temperature: 0,
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
                    "Content-Type": "application/json",
                },
            },
        );

        return response.data.choices[0].message.content;
    }
}
