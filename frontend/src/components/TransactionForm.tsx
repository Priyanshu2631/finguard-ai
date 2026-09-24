import { useState } from "react";

import {
    addTransaction,
} from "../services/transactionService";

import type {
    Transaction,
} from "../services/transactionService";


interface Props {
    onTransactionAdded: () => void;
    previousTransactions: number;
}


function TransactionForm({
    onTransactionAdded,
}: Props) {

    const [description, setDescription] =
        useState("");

    const [amount, setAmount] =
        useState("");

    const [category, setCategory] =
        useState("Food");

    const [type, setType] =
        useState("EXPENSE");

    const [date, setDate] =
        useState(
            new Date()
                .toISOString()
                .split("T")[0]
        );

    const [isSaving, setIsSaving] =
        useState(false);


    const handleSubmit = async (
        e: React.FormEvent
    ) => {

        e.preventDefault();


        const transaction: Transaction = {
            description,
            amount: Number(amount),
            category,
            type,
            date,
        };


        try {

            setIsSaving(true);


            await addTransaction(
                transaction
            );


            setDescription("");

            setAmount("");


            onTransactionAdded();


        } catch (error) {

            console.error(error);

            alert(
                "Failed to add transaction"
            );


        } finally {

            setIsSaving(false);

        }
    };


    return (
        <form
            className="transaction-form"
            onSubmit={handleSubmit}
        >

            <h2>
                Add Transaction
            </h2>


            <input
                type="text"
                placeholder="Description"
                value={description}
                onChange={(e) =>
                    setDescription(
                        e.target.value
                    )
                }
                required
            />


            <input
                type="number"
                placeholder="Amount"
                value={amount}
                onChange={(e) =>
                    setAmount(
                        e.target.value
                    )
                }
                min="1"
                required
            />


            <select
                value={category}
                onChange={(e) =>
                    setCategory(
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
                value={type}
                onChange={(e) =>
                    setType(
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
                value={date}
                onChange={(e) =>
                    setDate(
                        e.target.value
                    )
                }
            />


            <button
                type="submit"
                disabled={isSaving}
            >

                {isSaving
                    ? "Saving..."
                    : "Add Transaction"}

            </button>

        </form>
    );
}


export default TransactionForm;