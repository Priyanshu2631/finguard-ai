export interface Transaction {
    id?: number;
    description: string;
    amount: number;
    category: string;
    type: string;
    date: string;
}

const API_URL = "http://localhost:8080/api/transactions";

export const getTransactions = async (): Promise<Transaction[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error("Failed to fetch transactions");
    }

    return response.json();
};

export const addTransaction = async (
    transaction: Transaction
): Promise<Transaction> => {

    const response = await fetch(API_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
    });

    if (!response.ok) {
        throw new Error("Failed to add transaction");
    }

    return response.json();
};

export const updateTransaction = async (
    id: number,
    transaction: Transaction
): Promise<Transaction> => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(transaction),
    });

    if (!response.ok) {
        throw new Error("Failed to update transaction");
    }

    return response.json();
};

export const deleteTransaction = async (
    id: number
): Promise<void> => {

    const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Failed to delete transaction");
    }
};