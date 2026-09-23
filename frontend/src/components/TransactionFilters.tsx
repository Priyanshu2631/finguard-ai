import type { Transaction } from "../services/transactionService";

export interface TransactionFilters {
    search: string;
    category: string;
    type: string;
    date: string;
    sortBy: string;
}

interface TransactionFiltersProps {
    transactions: Transaction[];
    filters: TransactionFilters;
    onFilterChange: (
        filters: TransactionFilters
    ) => void;
    onReset: () => void;
}

function TransactionFilters({
    transactions,
    filters,
    onFilterChange,
    onReset,
}: TransactionFiltersProps) {

    const categories = Array.from(
        new Set(
            transactions.map(
                (transaction) => transaction.category
            )
        )
    );

    const handleChange = (
        field: keyof TransactionFilters,
        value: string
    ) => {

        onFilterChange({
            ...filters,
            [field]: value,
        });
    };

    return (
        <div className="transaction-filters">

            <div className="filter-header">

                <div>
                    <h3>Find Transactions</h3>

                    <p>
                        Search and filter your transaction history
                    </p>
                </div>

                <button
                    className="reset-button"
                    onClick={onReset}
                >
                    Reset Filters
                </button>

            </div>

            <div className="filter-grid">

                <input
                    type="text"
                    placeholder="Search description..."
                    value={filters.search}
                    onChange={(e) =>
                        handleChange(
                            "search",
                            e.target.value
                        )
                    }
                />

                <select
                    value={filters.category}
                    onChange={(e) =>
                        handleChange(
                            "category",
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Categories
                    </option>

                    {categories.map((category) => (
                        <option
                            key={category}
                            value={category}
                        >
                            {category}
                        </option>
                    ))}

                </select>

                <select
                    value={filters.type}
                    onChange={(e) =>
                        handleChange(
                            "type",
                            e.target.value
                        )
                    }
                >

                    <option value="">
                        All Types
                    </option>

                    <option value="INCOME">
                        Income
                    </option>

                    <option value="EXPENSE">
                        Expense
                    </option>

                </select>

                <input
                    type="date"
                    value={filters.date}
                    onChange={(e) =>
                        handleChange(
                            "date",
                            e.target.value
                        )
                    }
                />

                <select
                    value={filters.sortBy}
                    onChange={(e) =>
                        handleChange(
                            "sortBy",
                            e.target.value
                        )
                    }
                >

                    <option value="newest">
                        Newest First
                    </option>

                    <option value="oldest">
                        Oldest First
                    </option>

                    <option value="highest">
                        Highest Amount
                    </option>

                    <option value="lowest">
                        Lowest Amount
                    </option>

                </select>

            </div>

        </div>
    );
}

export default TransactionFilters;