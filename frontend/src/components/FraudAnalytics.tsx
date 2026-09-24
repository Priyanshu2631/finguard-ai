import type { Transaction } from "../services/transactionService";

interface Props {
    transactions: Transaction[];
}

function FraudAnalytics({
    transactions,
}: Props) {

    const analyzedTransactions =
        transactions.filter(
            (transaction) =>
                transaction.fraudProbability !==
                undefined
        );

    const highRiskTransactions =
        analyzedTransactions.filter(
            (transaction) =>
                transaction.fraud === true
        );

    const averageFraudProbability =
        analyzedTransactions.length > 0
            ? analyzedTransactions.reduce(
                (
                    sum,
                    transaction
                ) =>
                    sum +
                    (
                        transaction.fraudProbability ??
                        0
                    ),
                0
            ) /
            analyzedTransactions.length
            : 0;

    const riskRate =
        analyzedTransactions.length > 0
            ? (
                highRiskTransactions.length /
                analyzedTransactions.length
            ) *
            100
            : 0;

    const highestRiskTransaction =
        analyzedTransactions.length > 0
            ? [...analyzedTransactions].sort(
                (a, b) =>
                    (
                        b.fraudProbability ??
                        0
                    ) -
                    (
                        a.fraudProbability ??
                        0
                    )
            )[0]
            : null;

    return (
        <section className="fraud-analytics">

            <div className="fraud-analytics-header">
                <div>

                    <h2>
                        🤖 AI Fraud Insights
                    </h2>

                    <p>
                        Fraud risk analysis
                        powered by FinGuard AI
                    </p>

                </div>
            </div>

            {analyzedTransactions.length === 0 ? (

                <div className="fraud-empty-state">

                    <div className="fraud-empty-icon">
                        🛡️
                    </div>

                    <h3>
                        No Fraud Analysis Yet
                    </h3>

                    <p>
                        Analyze a transaction in
                        the Fraud Detection Lab
                        to see AI-powered risk
                        insights here.
                    </p>

                </div>

            ) : (

                <>
                    <div className="fraud-analytics-grid">

                        <div className="fraud-stat-card">

                            <span>
                                Transactions Analyzed
                            </span>

                            <strong>
                                {
                                    analyzedTransactions.length
                                }
                            </strong>

                        </div>

                        <div className="fraud-stat-card fraud-stat-danger">

                            <span>
                                High-Risk Transactions
                            </span>

                            <strong>
                                {
                                    highRiskTransactions.length
                                }
                            </strong>

                        </div>

                        <div className="fraud-stat-card">

                            <span>
                                Average Fraud Probability
                            </span>

                            <strong>
                                {
                                    (
                                        averageFraudProbability *
                                        100
                                    ).toFixed(1)
                                }
                                %
                            </strong>

                        </div>

                        <div className="fraud-stat-card">

                            <span>
                                High-Risk Rate
                            </span>

                            <strong>
                                {riskRate.toFixed(1)}%
                            </strong>

                        </div>

                    </div>

                    <div className="fraud-insight-panel">

                        <div>
                            <span>
                                Highest Risk Transaction
                            </span>

                            <strong>
                                {
                                    highestRiskTransaction
                                        ?.description ??
                                    "Unknown"
                                }
                            </strong>
                        </div>

                        <div>
                            <span>
                                Fraud Probability
                            </span>

                            <strong>
                                {(
                                    (
                                        highestRiskTransaction
                                            ?.fraudProbability ??
                                        0
                                    ) * 100
                                ).toFixed(1)}
                                %
                            </strong>
                        </div>

                        <div>
                            <span>
                                Transaction Amount
                            </span>

                            <strong>
                                ₹
                                {(
                                    highestRiskTransaction
                                        ?.amount ??
                                    0
                                ).toFixed(2)}
                            </strong>
                        </div>

                    </div>

                </>
            )}

        </section>
    );
}

export default FraudAnalytics;