import joblib
import pandas as pd


MODEL_PATH = "fraud_model.pkl"

FRAUD_THRESHOLD = 0.30


model_data = joblib.load(
    MODEL_PATH
)

model = model_data["model"]

feature_columns = model_data["features"]


def predict_fraud(
    time,
    amount,
    v1,
    v2,
    v3,
    v4,
    v5,
    v6,
    v7,
    v8,
    v9,
    v10,
    v11,
    v12,
    v13,
    v14,
    v15,
    v16,
    v17,
    v18,
    v19,
    v20,
    v21,
    v22,
    v23,
    v24,
    v25,
    v26,
    v27,
    v28
):

    transaction = pd.DataFrame([{
        "Time": time,
        "Amount": amount,

        "V1": v1,
        "V2": v2,
        "V3": v3,
        "V4": v4,
        "V5": v5,
        "V6": v6,
        "V7": v7,
        "V8": v8,
        "V9": v9,
        "V10": v10,
        "V11": v11,
        "V12": v12,
        "V13": v13,
        "V14": v14,
        "V15": v15,
        "V16": v16,
        "V17": v17,
        "V18": v18,
        "V19": v19,
        "V20": v20,
        "V21": v21,
        "V22": v22,
        "V23": v23,
        "V24": v24,
        "V25": v25,
        "V26": v26,
        "V27": v27,
        "V28": v28
    }])


    transaction = transaction[
        feature_columns
    ]


    probability = model.predict_proba(
        transaction
    )[0][1]


    prediction = (
        probability >= FRAUD_THRESHOLD
    )


    risk_indicators = []


    if probability >= 0.30:

        risk_indicators.append(
            "ML model detected elevated fraud risk"
        )


    if probability >= 0.70:

        risk_indicators.append(
            "Very high fraud probability"
        )


    if amount >= 1000:

        risk_indicators.append(
            "Relatively high transaction amount"
        )


    if amount >= 5000:

        risk_indicators.append(
            "High-value transaction"
        )


    if not risk_indicators:

        risk_indicators.append(
            "No major risk indicators detected"
        )


    return {
        "is_fraud": bool(prediction),

        "fraud_probability": round(
            float(probability),
            4
        ),

        "risk_indicators": risk_indicators
    }


if __name__ == "__main__":

    sample = {
        "time": 406.0,
        "amount": 149.62,

        "v1": -1.359807,
        "v2": -0.072781,
        "v3": 2.536347,
        "v4": 1.378155,
        "v5": -0.338321,
        "v6": 0.462388,
        "v7": 0.239599,
        "v8": 0.098698,
        "v9": 0.363787,
        "v10": 0.090794,
        "v11": -0.5516,
        "v12": -0.617801,
        "v13": -0.99139,
        "v14": -0.311169,
        "v15": 1.468177,
        "v16": -0.4704,
        "v17": 0.207971,
        "v18": 0.025791,
        "v19": 0.403993,
        "v20": 0.251412,
        "v21": -0.018307,
        "v22": 0.277838,
        "v23": -0.110474,
        "v24": 0.066928,
        "v25": 0.128539,
        "v26": -0.189115,
        "v27": 0.133558,
        "v28": -0.021053
    }


    result = predict_fraud(
        time=sample["time"],
        amount=sample["amount"],

        v1=sample["v1"],
        v2=sample["v2"],
        v3=sample["v3"],
        v4=sample["v4"],
        v5=sample["v5"],
        v6=sample["v6"],
        v7=sample["v7"],
        v8=sample["v8"],
        v9=sample["v9"],
        v10=sample["v10"],
        v11=sample["v11"],
        v12=sample["v12"],
        v13=sample["v13"],
        v14=sample["v14"],
        v15=sample["v15"],
        v16=sample["v16"],
        v17=sample["v17"],
        v18=sample["v18"],
        v19=sample["v19"],
        v20=sample["v20"],
        v21=sample["v21"],
        v22=sample["v22"],
        v23=sample["v23"],
        v24=sample["v24"],
        v25=sample["v25"],
        v26=sample["v26"],
        v27=sample["v27"],
        v28=sample["v28"]
    )


    print("\nPrediction:")
    print(result)