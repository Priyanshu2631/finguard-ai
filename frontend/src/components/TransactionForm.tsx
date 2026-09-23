import { useState } from "react";
import { addTransaction } from "../services/transactionService";

interface Props {
    onTransactionAdded: () => void;
}

function TransactionForm({ onTransactionAdded }: Props) {

    const [description, setDescription] = useState("");
    const [amount, setAmount] = useState("");
    const [category, setCategory] = useState("Food");
    const [type, setType] = useState("EXPENSE");
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await addTransaction({
                description,
                amount: Number(amount),
                category,
                type,
                date,
            });

            setDescription("");
            setAmount("");

            onTransactionAdded();

        } catch (error) {
            console.error(error);
            alert("Failed to add transaction");
        }
    };

    return (
        <form className="transaction-form" onSubmit={handleSubmit}>

            <h2>Add Transaction</h2>

            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />

            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
            >
                <option>Food</option>
                <option>Travel</option>
                <option>Shopping</option>
                <option>Bills</option>
                <option>Entertainment</option>
                <option>Salary</option>
                <option>Other</option>
            </select>

            <select
                value={type}
                onChange={(e) => setType(e.target.value)}
            >
                <option value="EXPENSE">Expense</option>
                <option value="INCOME">Income</option>
            </select>

            <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
            />

            <button type="submit">
                Add Transaction
            </button>

        </form>
    );
}

export default TransactionForm;