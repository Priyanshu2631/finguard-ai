import pandas as pd

from predict import predict_fraud


df = pd.read_csv("creditcard.csv")


normal_transaction = df[
    df["Class"] == 0
].iloc[0]


fraud_transaction = df[
    df["Class"] == 1
].iloc[0]


def run_prediction(transaction):

    return predict_fraud(
        time=transaction["Time"],
        amount=transaction["Amount"],

        v1=transaction["V1"],
        v2=transaction["V2"],
        v3=transaction["V3"],
        v4=transaction["V4"],
        v5=transaction["V5"],
        v6=transaction["V6"],
        v7=transaction["V7"],
        v8=transaction["V8"],
        v9=transaction["V9"],
        v10=transaction["V10"],
        v11=transaction["V11"],
        v12=transaction["V12"],
        v13=transaction["V13"],
        v14=transaction["V14"],
        v15=transaction["V15"],
        v16=transaction["V16"],
        v17=transaction["V17"],
        v18=transaction["V18"],
        v19=transaction["V19"],
        v20=transaction["V20"],
        v21=transaction["V21"],
        v22=transaction["V22"],
        v23=transaction["V23"],
        v24=transaction["V24"],
        v25=transaction["V25"],
        v26=transaction["V26"],
        v27=transaction["V27"],
        v28=transaction["V28"]
    )


print("\n" + "=" * 60)
print("NORMAL TRANSACTION TEST")
print("=" * 60)

normal_result = run_prediction(
    normal_transaction
)

print(
    "Actual Class     : 0"
)

print(
    "Prediction        :",
    normal_result["is_fraud"]
)

print(
    "Fraud Probability :",
    normal_result["fraud_probability"]
)

print(
    "Risk Indicators   :",
    normal_result["risk_indicators"]
)


print("\n" + "=" * 60)
print("FRAUD TRANSACTION TEST")
print("=" * 60)

fraud_result = run_prediction(
    fraud_transaction
)

print(
    "Actual Class     : 1"
)

print(
    "Prediction        :",
    fraud_result["is_fraud"]
)

print(
    "Fraud Probability :",
    fraud_result["fraud_probability"]
)

print(
    "Risk Indicators   :",
    fraud_result["risk_indicators"]
)


print("\n" + "=" * 60)
print("TEST COMPLETED")
print("=" * 60)