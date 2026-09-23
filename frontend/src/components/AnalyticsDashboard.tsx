import type { Transaction } from "../services/transactionService";

interface AnalyticsDashboardProps {
    transactions: Transaction[];
}

function AnalyticsDashboard({
    transactions,
}: AnalyticsDashboardProps) {

    const totalIncome = transactions
        .filter((transaction) => transaction.type === "INCOME")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const totalExpense = transactions
        .filter((transaction) => transaction.type === "EXPENSE")
        .reduce((sum, transaction) => sum + transaction.amount, 0);

    const balance = totalIncome - totalExpense;

    const savingsRate =
        totalIncome > 0
            ? ((balance / totalIncome) * 100)
            : 0;

    const categoryTotals: Record<string, number> = {};

    transactions
        .filter((transaction) => transaction.type === "EXPENSE")
        .forEach((transaction) => {

            if (!categoryTotals[transaction.category]) {
                categoryTotals[transaction.category] = 0;
            }

            categoryTotals[transaction.category] += transaction.amount;
        });

    const categories = Object.entries(categoryTotals)
        .sort((a, b) => b[1] - a[1]);

    const highestCategory =
        categories.length > 0
            ? categories[0]
            : null;

    const maxCategoryAmount =
        categories.length > 0
            ? categories[0][1]
            : 0;

    return (
        <section className="analytics-section">

            <div className="section-heading">
                <div>
                    <h2>Financial Overview</h2>
                    <p>
                        Understand your spending and saving patterns
                    </p>
                </div>
            </div>

            <div className="analytics-cards">

                <div className="analytics-card">
                    <span>Total Transactions</span>
                    <strong>{transactions.length}</strong>
                </div>

                <div className="analytics-card">
                    <span>Available Balance</span>
                    <strong>
                        ₹{balance.toFixed(2)}
                    </strong>
                </div>

                <div className="analytics-card">
                    <span>Savings Rate</span>
                    <strong>
                        {savingsRate.toFixed(1)}%
                    </strong>
                </div>

                <div className="analytics-card">
                    <span>Top Spending</span>
                    <strong>
                        {highestCategory
                            ? highestCategory[0]
                            : "No data"}
                    </strong>
                </div>

            </div>

            <div className="analytics-grid">

                <div className="analytics-panel">

                    <h3>Spending by Category</h3>

                    {categories.length === 0 ? (

                        <p className="empty-message">
                            Add some expense transactions to see
                            your spending breakdown.
                        </p>

                    ) : (

                        <div className="category-list">

                            {categories.map(
                                ([category, amount]) => {

                                    const percentage =
                                        maxCategoryAmount > 0
                                            ? (amount / maxCategoryAmount) * 100
                                            : 0;

                                    return (
                                        <div
                                            className="category-item"
                                            key={category}
                                        >

                                            <div className="category-info">

                                                <span>
                                                    {category}
                                                </span>

                                                <strong>
                                                    ₹{amount.toFixed(2)}
                                                </strong>

                                            </div>

                                            <div className="category-bar">
                                                <div
                                                    className="category-bar-fill"
                                                    style={{
                                                        width: `${percentage}%`,
                                                    }}
                                                />
                                            </div>

                                        </div>
                                    );
                                }
                            )}

                        </div>
                    )}

                </div>

                <div className="analytics-panel">

                    <h3>Financial Summary</h3>

                    <div className="summary-row">
                        <span>Total Income</span>
                        <strong>
                            ₹{totalIncome.toFixed(2)}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Total Expenses</span>
                        <strong>
                            ₹{totalExpense.toFixed(2)}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Balance</span>
                        <strong>
                            ₹{balance.toFixed(2)}
                        </strong>
                    </div>

                    <div className="summary-row">
                        <span>Saving Rate</span>
                        <strong>
                            {savingsRate.toFixed(1)}%
                        </strong>
                    </div>

                </div>

            </div>

        </section>
    );
}

export default AnalyticsDashboard;