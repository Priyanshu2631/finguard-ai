import { useEffect, useMemo, useState } from "react";

import {
    generateAiInsights,
} from "../services/transactionService";

import type {
    Transaction,
} from "../services/transactionService";

interface Props {
    transactions: Transaction[];
}

function formatInsightText(
    text: string
) {
    const lines = text.split("\n");

    return lines.map(
        (line, index) => {

            const trimmedLine =
                line.trim();

            if (!trimmedLine) {
                return (
                    <div
                        key={index}
                        className="ai-insight-space"
                    />
                );
            }

            const headingMatch =
                trimmedLine.match(
                    /^\*\*(.*?)\*\*$/
                );

            if (headingMatch) {
                return (
                    <h3
                        key={index}
                        className="ai-insight-heading"
                    >
                        {headingMatch[1]}
                    </h3>
                );
            }

            const bullet =
                trimmedLine.match(
                    /^[-•*]\s+(.*)$/
                );

            if (bullet) {
                return (
                    <div
                        key={index}
                        className="ai-insight-bullet"
                    >
                        <span>
                            •
                        </span>

                        <p>
                            {formatBoldText(
                                bullet[1]
                            )}
                        </p>
                    </div>
                );
            }

            return (
                <p
                    key={index}
                    className="ai-insight-text"
                >
                    {formatBoldText(
                        trimmedLine
                    )}
                </p>
            );
        }
    );
}

function formatBoldText(
    text: string
) {
    const parts =
        text.split(
            /(\*\*.*?\*\*)/g
        );

    return parts.map(
        (part, index) => {

            if (
                part.startsWith(
                    "**"
                ) &&
                part.endsWith(
                    "**"
                )
            ) {
                return (
                    <strong
                        key={index}
                    >
                        {part.slice(
                            2,
                            -2
                        )}
                    </strong>
                );
            }

            return part;
        }
    );
}

function AiFinancialInsights({
    transactions,
}: Props) {

    const [
        insights,
        setInsights,
    ] = useState("");

    const [
        loading,
        setLoading,
    ] = useState(false);

    const [
        error,
        setError,
    ] = useState("");

    const financialSummary =
        useMemo(() => {

            const income =
                transactions
                    .filter(
                        transaction =>
                            transaction.type ===
                            "INCOME"
                    )
                    .reduce(
                        (
                            sum,
                            transaction
                        ) =>
                            sum +
                            transaction.amount,
                        0
                    );

            const expenses =
                transactions
                    .filter(
                        transaction =>
                            transaction.type ===
                            "EXPENSE"
                    )
                    .reduce(
                        (
                            sum,
                            transaction
                        ) =>
                            sum +
                            transaction.amount,
                        0
                    );

            const balance =
                income - expenses;

            return {
                income,
                expenses,
                balance,
            };

        }, [transactions]);

    const loadInsights =
        async () => {

            if (
                transactions.length ===
                0
            ) {
                setInsights("");
                setError("");
                return;
            }

            try {

                setLoading(true);
                setError("");

                const result =
                    await generateAiInsights(
                        transactions
                    );

                setInsights(
                    result.insights
                );

            } catch (error) {

                console.error(
                    error
                );

                setError(
                    "Unable to generate AI insights right now. Make sure the ML service is running and try again."
                );

            } finally {

                setLoading(false);
            }
        };

    useEffect(() => {

        if (
            transactions.length >
            0
        ) {
            loadInsights();
        } else {
            setInsights("");
        }

    }, [transactions.length]);

    return (
        <section className="ai-financial-insights">

            <div className="ai-insights-header">

                <div>

                    <div className="ai-title-row">

                        <div className="ai-title-icon">
                            ✨
                        </div>

                        <div>
                            <h2>
                                AI Financial Insights
                            </h2>

                            <p>
                                Gemini analyzes your
                                transaction patterns
                                and highlights useful
                                observations.
                            </p>
                        </div>

                    </div>

                </div>

                <button
                    type="button"
                    onClick={
                        loadInsights
                    }
                    disabled={
                        loading ||
                        transactions.length ===
                        0
                    }
                >
                    {loading
                        ? "Analyzing..."
                        : "↻ Refresh Insights"}
                </button>

            </div>

            {transactions.length === 0 && (

                <div className="ai-insights-empty">

                    <div className="ai-empty-icon">
                        🤖
                    </div>

                    <h3>
                        No Financial Data Yet
                    </h3>

                    <p>
                        Add some transactions
                        to let Gemini analyze
                        your spending patterns.
                    </p>

                </div>
            )}

            {transactions.length > 0 && (

                <div className="ai-financial-snapshot">

                    <div className="ai-snapshot-card">

                        <span>
                            Transactions
                        </span>

                        <strong>
                            {
                                transactions.length
                            }
                        </strong>

                    </div>

                    <div className="ai-snapshot-card">

                        <span>
                            Income
                        </span>

                        <strong>
                            ₹
                            {financialSummary.income.toFixed(
                                2
                            )}
                        </strong>

                    </div>

                    <div className="ai-snapshot-card">

                        <span>
                            Expenses
                        </span>

                        <strong>
                            ₹
                            {financialSummary.expenses.toFixed(
                                2
                            )}
                        </strong>

                    </div>

                    <div className="ai-snapshot-card">

                        <span>
                            Balance
                        </span>

                        <strong
                            className={
                                financialSummary.balance <
                                0
                                    ? "ai-negative"
                                    : ""
                            }
                        >
                            ₹
                            {financialSummary.balance.toFixed(
                                2
                            )}
                        </strong>

                    </div>

                </div>
            )}

            {loading && (

                <div className="ai-insights-loading">

                    <div className="ai-thinking">

                        <span></span>
                        <span></span>
                        <span></span>

                    </div>

                    <div>

                        <strong>
                            Gemini is analyzing your finances
                        </strong>

                        <span>
                            Looking for spending patterns,
                            trends and useful observations...
                        </span>

                    </div>

                </div>
            )}

            {!loading &&
                error && (

                    <div className="ai-insights-error">

                        <strong>
                            ⚠️ AI Analysis Unavailable
                        </strong>

                        <span>
                            {error}
                        </span>

                        <button
                            type="button"
                            onClick={
                                loadInsights
                            }
                        >
                            Try Again
                        </button>

                    </div>
                )}

            {!loading &&
                !error &&
                insights && (

                    <div className="ai-insights-content">

                        <div className="ai-response-label">
                            <span>
                                ✨
                            </span>

                            <strong>
                                Gemini Analysis
                            </strong>
                        </div>

                        <div className="ai-response-body">

                            {formatInsightText(
                                insights
                            )}

                        </div>

                    </div>
                )}

        </section>
    );
}

export default AiFinancialInsights;