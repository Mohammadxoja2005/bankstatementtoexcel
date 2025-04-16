export const Infrastructure = {
    LanguageModel: {
        ChatGPT: Symbol.for("LanguageModelChatGPT"),
        Manager: Symbol.for("LanguageModelManager"),
    },
    FileBuilder: {
        Excel: Symbol.for("ExcelFileBuilder"),
    },
    TextExtractor: {
        PDF: Symbol.for("TextExtractorPDF"),
        Image: Symbol.for("TextExtractorImage"),
        Manager: Symbol.for("TextExtractorManager"),
    },
    Repository: {
        User: Symbol.for("UserRepository"),
    },
};
