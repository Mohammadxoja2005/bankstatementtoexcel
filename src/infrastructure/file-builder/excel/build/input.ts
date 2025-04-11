export type Input = {
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
