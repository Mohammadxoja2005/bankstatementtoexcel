export type BuildInput = {
    file: {
        name: string;
    };
    transactions: Array<{
        type: string;
        description: string;
        date: string;
        amount: string;
        currency: string;
        category: string;
    }>;
};

export type BuildOutput = string;
