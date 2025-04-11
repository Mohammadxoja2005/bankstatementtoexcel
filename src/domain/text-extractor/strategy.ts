export interface TextExtractorStrategy {
    extract(filePath: string): Promise<string[]>;
}
