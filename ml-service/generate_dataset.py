import pandas as pd
import random

random.seed(42)

categories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Entertainment",
    "Salary",
    "Other"
]

transaction_types = ["EXPENSE", "INCOME"]

rows = []

for _ in range(5000):

    amount = round(random.uniform(50, 100000), 2)
    category = random.choice(categories)
    transaction_type = random.choice(transaction_types)

    hour = random.randint(0, 23)
    location_distance = round(random.uniform(0, 1000), 2)
    previous_transactions = random.randint(0, 20)

    is_fraud = 0

    if amount > 50000:
        is_fraud = 1

    if hour < 5:
        is_fraud = 1

    if location_distance > 700:
        is_fraud = 1

    if previous_transactions == 0 and amount > 20000:
        is_fraud = 1

    if category == "Shopping" and amount > 30000:
        is_fraud = 1

    if random.random() < 0.02:
        is_fraud = 1

    rows.append({
        "amount": amount,
        "category": category,
        "type": transaction_type,
        "hour": hour,
        "location_distance": location_distance,
        "previous_transactions": previous_transactions,
        "is_fraud": is_fraud
    })

df = pd.DataFrame(rows)

df.to_csv("transactions.csv", index=False)

print("Dataset generated successfully.")
print(f"Total transactions: {len(df)}")
print(f"Fraudulent transactions: {df['is_fraud'].sum()}")
print(f"Normal transactions: {len(df) - df['is_fraud'].sum()}")