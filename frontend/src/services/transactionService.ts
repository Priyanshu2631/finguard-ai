export interface Transaction {
    id?: number;
    description: string;
    amount: number;
    category: string;
    type: string;
    date: string;
    fraud?: boolean;
    fraudProbability?: number;
}

export interface FraudAnalysis {
    fraud: boolean;
    fraudProbability: number;
    riskIndicators: string[];
}

export interface RealFraudRequest {
    time: number;
    amount: number;

    v1: number;
    v2: number;
    v3: number;
    v4: number;
    v5: number;
    v6: number;
    v7: number;
    v8: number;
    v9: number;
    v10: number;
    v11: number;
    v12: number;
    v13: number;
    v14: number;
    v15: number;
    v16: number;
    v17: number;
    v18: number;
    v19: number;
    v20: number;
    v21: number;
    v22: number;
    v23: number;
    v24: number;
    v25: number;
    v26: number;
    v27: number;
    v28: number;
}

export interface AiAssistantResponse {
    answer: string;
}

export interface AiInsightsResponse {
    insights: string;
}

const API_URL =
    "http://localhost:8080/api/transactions";

const FRAUD_API_URL =
    "http://localhost:5000/predict";

const AI_API_URL =
    "http://localhost:8080/api/assistant";

const INSIGHTS_API_URL =
    "http://localhost:8080/api/insights";


const getErrorMessage = async (
    response: Response,
    fallback: string
): Promise<string> => {

    try {

        const data =
            await response.json();

        if (
            data &&
            typeof data.error === "string"
        ) {
            return data.error;
        }

    } catch {
        // Ignore invalid JSON responses.
    }

    return fallback;
};


export const getTransactions =
    async (): Promise<Transaction[]> => {

        const response =
            await fetch(API_URL);

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Failed to fetch transactions"
                )
            );
        }

        return response.json();
    };


export const addTransaction =
    async (
        transaction: Transaction
    ): Promise<Transaction> => {

        const response =
            await fetch(API_URL, {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/json",
                },
                body: JSON.stringify(
                    transaction
                ),
            });

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Failed to add transaction"
                )
            );
        }

        return response.json();
    };


export const updateTransaction =
    async (
        id: number,
        transaction: Transaction
    ): Promise<Transaction> => {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        transaction
                    ),
                }
            );

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Failed to update transaction"
                )
            );
        }

        return response.json();
    };


export const deleteTransaction =
    async (
        id: number
    ): Promise<void> => {

        const response =
            await fetch(
                `${API_URL}/${id}`,
                {
                    method: "DELETE",
                }
            );

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Failed to delete transaction"
                )
            );
        }
    };


export const updateFraudAnalysis =
    async (
        id: number,
        fraud: boolean,
        fraudProbability: number
    ): Promise<Transaction> => {

        const response =
            await fetch(
                `${API_URL}/${id}/fraud-analysis`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        fraud,
                        fraudProbability,
                    }),
                }
            );

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Failed to update fraud analysis"
                )
            );
        }

        return response.json();
    };


export const analyzeRealFraudTransaction =
    async (
        transaction: RealFraudRequest
    ): Promise<FraudAnalysis> => {

        const response =
            await fetch(
                FRAUD_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify(
                        transaction
                    ),
                }
            );

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Failed to analyze fraud transaction"
                )
            );
        }

        const data =
            await response.json();

        return {
            fraud: Boolean(
                data.is_fraud ??
                data.fraud
            ),

            fraudProbability: Number(
                data.fraud_probability ??
                data.fraudProbability ??
                0
            ),

            riskIndicators:
                data.risk_indicators ??
                data.riskIndicators ??
                [],
        };
    };


export const askAiAssistant =
    async (
        question: string,
        transactions: Transaction[]
    ): Promise<AiAssistantResponse> => {

        const response =
            await fetch(
                AI_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        question,
                        transactions,
                    }),
                }
            );

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Unable to connect to FinGuard AI."
                )
            );
        }

        return response.json();
    };


export const generateAiInsights =
    async (
        transactions: Transaction[]
    ): Promise<AiInsightsResponse> => {

        const response =
            await fetch(
                INSIGHTS_API_URL,
                {
                    method: "POST",
                    headers: {
                        "Content-Type":
                            "application/json",
                    },
                    body: JSON.stringify({
                        transactions,
                    }),
                }
            );

        if (!response.ok) {

            throw new Error(
                await getErrorMessage(
                    response,
                    "Unable to generate AI insights."
                )
            );
        }

        return response.json();
    };