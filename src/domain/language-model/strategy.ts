export interface LanguageModelStrategy {
    extractTransactionsFromText(text: string): Promise<string>
}