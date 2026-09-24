import { useEffect, useMemo, useState } from "react";

import TransactionForm from "./components/TransactionForm";
import AnalyticsDashboard from "./components/AnalyticsDashboard";
import TransactionFilters from "./components/TransactionFilters";
import FraudAnalytics from "./components/FraudAnalytics";
import AiFinancialInsights from "./components/AiFinancialInsights";
import FraudDetectionLab from "./components/FraudDetectionLab";
import AiAssistant from "./components/AiAssistant";

import type {
    TransactionFilters as FilterState,
} from "./components/TransactionFilters";

import {
    getTransactions,
    updateTransaction,
    deleteTransaction,
} from "./services/transactionService";

import type {
    Transaction,
} from "./services/transactionService";

import "./App.css";


function App() {

    const [transactions, setTransactions] =
        useState<Transaction[]>([]);

    const [editingId, setEditingId] =
        useState<number | null>(null);

    const [filters, setFilters] =
        useState<FilterState>({
            search: "",
            category: "",
            type: "",
            date: "",
            sortBy: "newest",
        });

    const [editDescription, setEditDescription] =
        useState("");

    const [editAmount, setEditAmount] =
        useState("");

    const [editCategory, setEditCategory] =
        useState("Food");

    const [editType, setEditType] =
        useState("EXPENSE");

    const [editDate, setEditDate] =
        useState("");


    const loadTransactions = async () => {

        try {

            const data =
                await getTransactions();

            setTransactions(data);

        } catch (error) {

            console.error(error);

        }
    };


    useEffect(() => {
        loadTransactions();
    }, []);


    const handleDelete = async (
        id: number
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this transaction?"
            );

        if (!confirmed) {
            return;
        }

        try {

            await deleteTransaction(id);

            await loadTransactions();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to delete transaction"
            );
        }
    };


    const startEditing = (
        transaction: Transaction
    ) => {

        setEditingId(
            transaction.id ?? null
        );

        setEditDescription(
            transaction.description
        );

        setEditAmount(
            transaction.amount.toString()
        );

        setEditCategory(
            transaction.category
        );

        setEditType(
            transaction.type
        );

        setEditDate(
            transaction.date
        );
    };


    const cancelEditing = () => {
        setEditingId(null);
    };


    const handleUpdate = async (
        id: number
    ) => {

        try {

            await updateTransaction(
                id,
                {
                    id,

                    description:
                        editDescription,

                    amount:
                        Number(editAmount),

                    category:
                        editCategory,

                    type:
                        editType,

                    date:
                        editDate,
                }
            );

            setEditingId(null);

            await loadTransactions();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to update transaction"
            );
        }
    };


    const filteredTransactions =
        useMemo(() => {

            let result =
                [...transactions];


            if (filters.search.trim()) {

                const search =
                    filters.search
                        .toLowerCase()
                        .trim();

                result =
                    result.filter(
                        (transaction) =>
                            transaction.description
                                .toLowerCase()
                                .includes(search)
                    );
            }


            if (filters.category) {

                result =
                    result.filter(
                        (transaction) =>
                            transaction.category ===
                            filters.category
                    );
            }


            if (filters.type) {

                result =
                    result.filter(
                        (transaction) =>
                            transaction.type ===
                            filters.type
                    );
            }


            if (filters.date) {

                result =
                    result.filter(
                        (transaction) =>
                            transaction.date ===
                            filters.date
                    );
            }


            result.sort((a, b) => {

                switch (filters.sortBy) {

                    case "oldest":

                        return a.date.localeCompare(
                            b.date
                        );

                    case "highest":

                        return b.amount - a.amount;

                    case "lowest":

                        return a.amount - b.amount;

                    case "newest":

                    default:

                        return b.date.localeCompare(
                            a.date
                        );
                }
            });


            return result;

        }, [transactions, filters]);


    const resetFilters = () => {

        setFilters({
            search: "",
            category: "",
            type: "",
            date: "",
            sortBy: "newest",
        });
    };


    const totalIncome =
        transactions
            .filter(
                (transaction) =>
                    transaction.type === "INCOME"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );


    const totalExpense =
        transactions
            .filter(
                (transaction) =>
                    transaction.type === "EXPENSE"
            )
            .reduce(
                (sum, transaction) =>
                    sum + transaction.amount,
                0
            );


    const balance =
        totalIncome - totalExpense;


    return (

        <div className="app">

            <header>

                <h1>
                    FinGuard AI
                </h1>

                <p>
                    Smart Personal Finance &
                    Fraud Detection
                </p>

            </header>


            <div className="summary">

                <div className="card">

                    <h3>
                        Total Income
                    </h3>

                    <p>
                        ₹
                        {totalIncome.toFixed(2)}
                    </p>

                </div>


                <div className="card">

                    <h3>
                        Total Expenses
                    </h3>

                    <p>
                        ₹
                        {totalExpense.toFixed(2)}
                    </p>

                </div>


                <div className="card">

                    <h3>
                        Balance
                    </h3>

                    <p>
                        ₹
                        {balance.toFixed(2)}
                    </p>

                </div>

            </div>


            <AnalyticsDashboard
                transactions={transactions}
            />


            <FraudDetectionLab
                transactions={transactions}
                onAnalysisSaved={
                    loadTransactions
                }
            />


            <FraudAnalytics
                transactions={transactions}
            />


            <AiFinancialInsights
                transactions={transactions}
            />


            <AiAssistant
                transactions={transactions}
            />


            <div className="content">

                <TransactionForm
                    onTransactionAdded={
                        loadTransactions
                    }

                    previousTransactions={
                        transactions.length
                    }
                />


                <div className="transactions">

                    <TransactionFilters
                        transactions={
                            transactions
                        }

                        filters={
                            filters
                        }

                        onFilterChange={
                            setFilters
                        }

                        onReset={
                            resetFilters
                        }
                    />


                    <div className="transaction-heading">

                        <h2>
                            Recent Transactions
                        </h2>

                        <span>
                            Showing{" "}
                            {
                                filteredTransactions.length
                            }{" "}
                            of{" "}
                            {
                                transactions.length
                            }
                        </span>

                    </div>


                    {
                        filteredTransactions.length ===
                        0 ? (

                            <p className="empty-message">
                                No transactions match
                                your filters.
                            </p>

                        ) : (

                            filteredTransactions.map(
                                (transaction) => (

                                    <div
                                        className="transaction"
                                        key={
                                            transaction.id
                                        }
                                    >

                                        {
                                            editingId ===
                                            transaction.id ? (

                                                <div
                                                    className="edit-form"
                                                >

                                                    <input
                                                        type="text"
                                                        value={
                                                            editDescription
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditDescription(
                                                                    e.target.value
                                                                )
                                                        }
                                                    />


                                                    <input
                                                        type="number"
                                                        value={
                                                            editAmount
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditAmount(
                                                                    e.target.value
                                                                )
                                                        }
                                                    />


                                                    <select
                                                        value={
                                                            editCategory
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditCategory(
                                                                    e.target.value
                                                                )
                                                        }
                                                    >

                                                        <option>
                                                            Food
                                                        </option>

                                                        <option>
                                                            Travel
                                                        </option>

                                                        <option>
                                                            Shopping
                                                        </option>

                                                        <option>
                                                            Bills
                                                        </option>

                                                        <option>
                                                            Entertainment
                                                        </option>

                                                        <option>
                                                            Salary
                                                        </option>

                                                        <option>
                                                            Other
                                                        </option>

                                                    </select>


                                                    <select
                                                        value={
                                                            editType
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditType(
                                                                    e.target.value
                                                                )
                                                        }
                                                    >

                                                        <option value="EXPENSE">
                                                            Expense
                                                        </option>

                                                        <option value="INCOME">
                                                            Income
                                                        </option>

                                                    </select>


                                                    <input
                                                        type="date"
                                                        value={
                                                            editDate
                                                        }
                                                        onChange={
                                                            (e) =>
                                                                setEditDate(
                                                                    e.target.value
                                                                )
                                                        }
                                                    />


                                                    <div
                                                        className="edit-buttons"
                                                    >

                                                        <button
                                                            onClick={() =>
                                                                handleUpdate(
                                                                    transaction.id!
                                                                )
                                                            }
                                                        >
                                                            Save
                                                        </button>


                                                        <button
                                                            onClick={
                                                                cancelEditing
                                                            }
                                                        >
                                                            Cancel
                                                        </button>

                                                    </div>

                                                </div>

                                            ) : (

                                                <>

                                                    <div
                                                        className="transaction-main"
                                                    >

                                                        <strong>
                                                            {
                                                                transaction.description
                                                            }
                                                        </strong>


                                                        <span>
                                                            {
                                                                transaction.category
                                                            }

                                                            {" • "}

                                                            {
                                                                transaction.date
                                                            }
                                                        </span>


                                                        <div
                                                            className={
                                                                transaction.fraud
                                                                    ? "fraud-badge fraud-badge-high"
                                                                    : "fraud-badge fraud-badge-low"
                                                            }
                                                        >

                                                            <span className="fraud-badge-icon">

                                                                {
                                                                    transaction.fraud
                                                                        ? "⚠️"
                                                                        : "🟢"
                                                                }

                                                            </span>


                                                            <span>

                                                                {
                                                                    transaction.fraud
                                                                        ? "High Fraud Risk"
                                                                        : "Low Fraud Risk"
                                                                }

                                                            </span>


                                                            <strong>

                                                                {(
                                                                    (transaction.fraudProbability ?? 0) *
                                                                    100
                                                                ).toFixed(1)}

                                                                %

                                                            </strong>

                                                        </div>

                                                    </div>


                                                    <div
                                                        className="transaction-right"
                                                    >

                                                        <strong>

                                                            {
                                                                transaction.type ===
                                                                "INCOME"
                                                                    ? "+"
                                                                    : "-"
                                                            }

                                                            ₹

                                                            {
                                                                transaction.amount
                                                            }

                                                        </strong>


                                                        <div
                                                            className="transaction-actions"
                                                        >

                                                            <button
                                                                onClick={() =>
                                                                    startEditing(
                                                                        transaction
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>


                                                            <button
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        transaction.id!
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    </div>

                                                </>

                                            )
                                        }

                                    </div>

                                )
                            )

                        )
                    }

                </div>

            </div>

        </div>
    );
}


export default App;