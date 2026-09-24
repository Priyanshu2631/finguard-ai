import pandas as pd
import requests


df = pd.read_csv("creditcard.csv")

fraud = df[
    df["Class"] == 1
].iloc[0]


payload = {
    "time": float(fraud["Time"]),
    "amount": float(fraud["Amount"]),

    "v1": float(fraud["V1"]),
    "v2": float(fraud["V2"]),
    "v3": float(fraud["V3"]),
    "v4": float(fraud["V4"]),
    "v5": float(fraud["V5"]),
    "v6": float(fraud["V6"]),
    "v7": float(fraud["V7"]),
    "v8": float(fraud["V8"]),
    "v9": float(fraud["V9"]),
    "v10": float(fraud["V10"]),
    "v11": float(fraud["V11"]),
    "v12": float(fraud["V12"]),
    "v13": float(fraud["V13"]),
    "v14": float(fraud["V14"]),
    "v15": float(fraud["V15"]),
    "v16": float(fraud["V16"]),
    "v17": float(fraud["V17"]),
    "v18": float(fraud["V18"]),
    "v19": float(fraud["V19"]),
    "v20": float(fraud["V20"]),
    "v21": float(fraud["V21"]),
    "v22": float(fraud["V22"]),
    "v23": float(fraud["V23"]),
    "v24": float(fraud["V24"]),
    "v25": float(fraud["V25"]),
    "v26": float(fraud["V26"]),
    "v27": float(fraud["V27"]),
    "v28": float(fraud["V28"])
}


response = requests.post(
    "http://localhost:8080/api/fraud/predict",
    json=payload
)


print("\nStatus Code:")
print(response.status_code)


print("\nSpring Boot Response:")
print(response.text)