import { useState } from "react";

import {
    analyzeRealFraudTransaction,
    updateFraudAnalysis,
} from "../services/transactionService";

import type {
    FraudAnalysis,
    RealFraudRequest,
    Transaction,
} from "../services/transactionService";


interface Props {
    transactions: Transaction[];
    onAnalysisSaved: () => void;
}


const normalTransaction: RealFraudRequest = {
    time: 406,
    amount: 1.98,

    v1: 1.192,
    v2: -0.845,
    v3: 0.321,
    v4: -0.412,
    v5: 0.782,
    v6: -0.231,
    v7: 0.514,
    v8: -0.104,
    v9: 0.621,
    v10: -0.342,
    v11: 0.451,
    v12: -0.287,
    v13: 0.163,
    v14: 0.421,
    v15: -0.312,
    v16: 0.245,
    v17: 0.387,
    v18: -0.192,
    v19: 0.156,
    v20: -0.087,
    v21: 0.121,
    v22: 0.045,
    v23: -0.132,
    v24: 0.214,
    v25: -0.071,
    v26: 0.118,
    v27: 0.092,
    v28: -0.063,
};


const fraudTransaction: RealFraudRequest = {
    time: 406,
    amount: 0,

    v1: -2.312227,
    v2: 1.951992,
    v3: -1.609851,
    v4: 3.997906,
    v5: -0.522188,
    v6: -1.426545,
    v7: -2.537387,
    v8: 1.391657,
    v9: -2.770089,
    v10: -2.772272,
    v11: 3.202033,
    v12: -2.899907,
    v13: -0.595222,
    v14: -4.289254,
    v15: 0.389724,
    v16: -1.140747,
    v17: -2.830056,
    v18: -0.016822,
    v19: 0.416956,
    v20: 0.126911,
    v21: 0.517232,
    v22: -0.035049,
    v23: -0.465211,
    v24: 0.320198,
    v25: 0.044519,
    v26: 0.177840,
    v27: 0.261145,
    v28: -0.143276,
};


function FraudDetectionLab({
    transactions,
    onAnalysisSaved,
}: Props) {

    const [transaction, setTransaction] =
        useState<RealFraudRequest>(
            fraudTransaction
        );

    const [analysis, setAnalysis] =
        useState<FraudAnalysis | null>(
            null
        );

    const [selectedExample, setSelectedExample] =
        useState<"fraud" | "normal">(
            "fraud"
        );

    const [selectedTransactionId, setSelectedTransactionId] =
        useState<number | "">("");

    const [isAnalyzing, setIsAnalyzing] =
        useState(false);

    const [isSaving, setIsSaving] =
        useState(false);

    const [showAdvanced, setShowAdvanced] =
        useState(false);


    const handleChange = (
        field: keyof RealFraudRequest,
        value: string
    ) => {

        setTransaction(
            previous => ({
                ...previous,
                [field]: Number(value),
            })
        );

        setAnalysis(null);
    };


    const loadExample = (
        type: "fraud" | "normal"
    ) => {

        if (type === "fraud") {

            setTransaction({
                ...fraudTransaction,
            });

            setSelectedExample(
                "fraud"
            );

        } else {

            setTransaction({
                ...normalTransaction,
            });

            setSelectedExample(
                "normal"
            );
        }

        setAnalysis(null);
    };


    const handleAnalyze = async () => {

        try {

            setIsAnalyzing(true);

            setAnalysis(null);

            const result =
                await analyzeRealFraudTransaction(
                    transaction
                );

            setAnalysis(result);

        } catch (error) {

            console.error(error);

            alert(
                "Failed to analyze transaction. Make sure the ML service and Spring Boot backend are running."
            );

        } finally {

            setIsAnalyzing(false);
        }
    };


    const handleSaveAnalysis = async () => {

        if (selectedTransactionId === "") {

            alert(
                "Please select a transaction first."
            );

            return;
        }

        if (!analysis) {

            alert(
                "Analyze the transaction before saving the result."
            );

            return;
        }

        try {

            setIsSaving(true);

            await updateFraudAnalysis(
                selectedTransactionId,
                analysis.fraud,
                analysis.fraudProbability
            );

            alert(
                "Fraud analysis saved to the transaction."
            );

            onAnalysisSaved();

        } catch (error) {

            console.error(error);

            alert(
                "Failed to save fraud analysis."
            );

        } finally {

            setIsSaving(false);
        }
    };


    const handleReset = () => {

        setTransaction({
            ...fraudTransaction,
        });

        setSelectedExample(
            "fraud"
        );

        setSelectedTransactionId(
            ""
        );

        setAnalysis(null);
    };


    const featureFields = Array.from(
        { length: 28 },
        (_, index) =>
            `v${index + 1}` as keyof RealFraudRequest
    );


    return (

        <section className="fraud-lab">

            <div className="fraud-lab-header">

                <div>

                    <h2>
                        🔬 Fraud Detection Lab
                    </h2>

                    <p>
                        Test transactions using the
                        trained Random Forest model.
                    </p>

                </div>

            </div>


            <div className="fraud-lab-note">

                <strong>
                    🤖 Real Machine Learning Model
                </strong>

                <span>
                    FinGuard AI uses a Random Forest
                    classifier trained on the ULB
                    Credit Card Fraud Detection dataset.
                </span>

                <span>
                    The model analyzes Time, Amount and
                    28 anonymized PCA features to
                    estimate fraud probability.
                </span>

            </div>


            <div className="fraud-transaction-selector">

                <h3>
                    Attach Analysis to Transaction
                </h3>

                <p>
                    Select one of your saved transactions
                    to store the ML analysis result.
                </p>

                <select
                    value={
                        selectedTransactionId
                    }
                    onChange={(e) =>
                        setSelectedTransactionId(
                            e.target.value
                                ? Number(
                                    e.target.value
                                )
                                : ""
                        )
                    }
                >

                    <option value="">
                        Select a transaction
                    </option>

                    {transactions.map(
                        item => (

                            <option
                                key={item.id}
                                value={item.id}
                            >
                                {item.description}
                                {" — ₹"}
                                {item.amount.toFixed(2)}
                            </option>

                        )
                    )}

                </select>

            </div>


            <div className="fraud-example-section">

                <h3>
                    Quick Demo
                </h3>

                <p>
                    Load a real dataset example and
                    send it to the trained ML model.
                </p>


                <div className="fraud-demo-buttons">

                    <button
                        type="button"
                        className={
                            selectedExample ===
                            "normal"
                                ? "demo-button normal-demo selected-demo"
                                : "demo-button normal-demo"
                        }
                        onClick={() =>
                            loadExample(
                                "normal"
                            )
                        }
                    >
                        🟢 Normal Example
                    </button>


                    <button
                        type="button"
                        className={
                            selectedExample ===
                            "fraud"
                                ? "demo-button fraud-demo selected-demo"
                                : "demo-button fraud-demo"
                        }
                        onClick={() =>
                            loadExample(
                                "fraud"
                            )
                        }
                    >
                        🔴 Fraud Example
                    </button>

                </div>

            </div>


            <div className="fraud-basic-fields">

                <div className="fraud-field">

                    <label>
                        Time
                    </label>

                    <input
                        type="number"
                        value={
                            transaction.time
                        }
                        onChange={(e) =>
                            handleChange(
                                "time",
                                e.target.value
                            )
                        }
                    />

                </div>


                <div className="fraud-field">

                    <label>
                        Amount
                    </label>

                    <input
                        type="number"
                        step="any"
                        value={
                            transaction.amount
                        }
                        onChange={(e) =>
                            handleChange(
                                "amount",
                                e.target.value
                            )
                        }
                    />

                </div>

            </div>


            <button
                type="button"
                className="advanced-toggle"
                onClick={() =>
                    setShowAdvanced(
                        previous =>
                            !previous
                    )
                }
            >
                {showAdvanced
                    ? "▲ Hide Model Features"
                    : "▼ View Model Features (V1–V28)"}
            </button>


            {showAdvanced && (

                <div className="advanced-feature-section">

                    <div className="advanced-info">

                        <strong>
                            About V1–V28
                        </strong>

                        <p>
                            These are anonymized PCA
                            features from the ULB dataset.
                            They are numerical representations
                            used by the Random Forest model.
                        </p>

                    </div>


                    <div className="fraud-feature-grid">

                        {featureFields.map(
                            field => (

                                <div
                                    className="fraud-field"
                                    key={field}
                                >

                                    <label>
                                        {field.toUpperCase()}
                                    </label>

                                    <input
                                        type="number"
                                        step="any"
                                        value={
                                            transaction[
                                                field
                                            ]
                                        }
                                        onChange={(e) =>
                                            handleChange(
                                                field,
                                                e.target.value
                                            )
                                        }
                                    />

                                </div>

                            )
                        )}

                    </div>

                </div>

            )}


            <div className="fraud-lab-actions">

                <button
                    type="button"
                    onClick={
                        handleAnalyze
                    }
                    disabled={
                        isAnalyzing
                    }
                >
                    {isAnalyzing
                        ? "⏳ Analyzing..."
                        : "🔍 Analyze Transaction"}
                </button>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleSaveAnalysis
                    }
                    disabled={
                        isSaving ||
                        !analysis ||
                        selectedTransactionId === ""
                    }
                >
                    {isSaving
                        ? "Saving..."
                        : "💾 Save to Transaction"}
                </button>


                <button
                    type="button"
                    className="secondary-button"
                    onClick={
                        handleReset
                    }
                >
                    Reset
                </button>

            </div>


            {analysis && (

                <div
                    className={`fraud-lab-result ${
                        analysis.fraud
                            ? "fraud-high"
                            : "fraud-low"
                    }`}
                >

                    <h3>
                        {analysis.fraud
                            ? "⚠️ Fraud Detected"
                            : "🟢 Transaction Appears Normal"}
                    </h3>


                    <div className="fraud-probability">

                        <span>
                            Fraud Probability
                        </span>

                        <strong>
                            {(
                                analysis.fraudProbability *
                                100
                            ).toFixed(1)}
                            %
                        </strong>

                    </div>


                    <div className="risk-indicators">

                        <strong>
                            Risk Indicators
                        </strong>

                        <ul>

                            {analysis.riskIndicators.map(
                                (
                                    indicator,
                                    index
                                ) => (

                                    <li
                                        key={index}
                                    >
                                        {indicator}
                                    </li>

                                )
                            )}

                        </ul>

                    </div>

                </div>

            )}

        </section>
    );
}


export default FraudDetectionLab;