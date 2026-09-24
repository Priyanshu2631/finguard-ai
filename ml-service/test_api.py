import requests
import pandas as pd


df = pd.read_csv("creditcard.csv")


fraud = df[
    df["Class"] == 1
].iloc[0]


payload = {
    "time": fraud["Time"],
    "amount": fraud["Amount"],

    "v1": fraud["V1"],
    "v2": fraud["V2"],
    "v3": fraud["V3"],
    "v4": fraud["V4"],
    "v5": fraud["V5"],
    "v6": fraud["V6"],
    "v7": fraud["V7"],
    "v8": fraud["V8"],
    "v9": fraud["V9"],
    "v10": fraud["V10"],
    "v11": fraud["V11"],
    "v12": fraud["V12"],
    "v13": fraud["V13"],
    "v14": fraud["V14"],
    "v15": fraud["V15"],
    "v16": fraud["V16"],
    "v17": fraud["V17"],
    "v18": fraud["V18"],
    "v19": fraud["V19"],
    "v20": fraud["V20"],
    "v21": fraud["V21"],
    "v22": fraud["V22"],
    "v23": fraud["V23"],
    "v24": fraud["V24"],
    "v25": fraud["V25"],
    "v26": fraud["V26"],
    "v27": fraud["V27"],
    "v28": fraud["V28"]
}


response = requests.post(
    "http://localhost:5000/predict",
    json=payload
)


print("\nStatus Code:")
print(response.status_code)


print("\nAPI Response:")
print(response.json())