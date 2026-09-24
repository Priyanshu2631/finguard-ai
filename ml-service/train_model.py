import pandas as pd
import joblib

from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    roc_auc_score,
    average_precision_score,
    classification_report,
    confusion_matrix
)


DATASET_PATH = "creditcard.csv"
MODEL_PATH = "fraud_model.pkl"


print("\nLoading dataset...")

df = pd.read_csv(DATASET_PATH)

print(f"Dataset shape: {df.shape}")


feature_columns = [
    "Time",
    "Amount"
]

feature_columns += [
    f"V{i}"
    for i in range(1, 29)
]


target_column = "Class"


missing_columns = [
    column
    for column in feature_columns + [target_column]
    if column not in df.columns
]


if missing_columns:

    raise ValueError(
        "Missing columns in dataset: "
        + ", ".join(missing_columns)
    )


X = df[feature_columns]

y = df[target_column]


print("\nClass distribution:")

print(y.value_counts())


print("\nFraud percentage:")

print(
    f"{y.mean() * 100:.4f}%"
)


X_train, X_test, y_train, y_test = train_test_split(
    X,
    y,
    test_size=0.20,
    random_state=42,
    stratify=y
)


print("\nTraining Random Forest model...")


model = RandomForestClassifier(
    n_estimators=200,
    max_depth=None,
    min_samples_split=2,
    min_samples_leaf=1,
    class_weight="balanced_subsample",
    random_state=42,
    n_jobs=-1
)


model.fit(
    X_train,
    y_train
)


print("Model training completed.")


predictions = model.predict(X_test)

probabilities = model.predict_proba(X_test)[:, 1]


accuracy = accuracy_score(
    y_test,
    predictions
)

precision = precision_score(
    y_test,
    predictions,
    zero_division=0
)

recall = recall_score(
    y_test,
    predictions,
    zero_division=0
)

f1 = f1_score(
    y_test,
    predictions,
    zero_division=0
)

roc_auc = roc_auc_score(
    y_test,
    probabilities
)

pr_auc = average_precision_score(
    y_test,
    probabilities
)


print("\n" + "=" * 60)

print("MODEL EVALUATION")

print("=" * 60)

print(
    f"Accuracy          : {accuracy:.4f}"
)

print(
    f"Precision         : {precision:.4f}"
)

print(
    f"Recall            : {recall:.4f}"
)

print(
    f"F1 Score          : {f1:.4f}"
)

print(
    f"ROC-AUC           : {roc_auc:.4f}"
)

print(
    f"PR-AUC            : {pr_auc:.4f}"
)


print("\nClassification Report:")

print(
    classification_report(
        y_test,
        predictions,
        digits=4,
        zero_division=0
    )
)


print("\nConfusion Matrix:")

print(
    confusion_matrix(
        y_test,
        predictions
    )
)


print("\n" + "=" * 60)

print("THRESHOLD ANALYSIS")

print("=" * 60)


thresholds = [
    0.50,
    0.40,
    0.30,
    0.20,
    0.10
]


print(
    f"{'Threshold':<12}"
    f"{'Precision':<12}"
    f"{'Recall':<12}"
    f"{'F1':<12}"
    f"{'FP':<10}"
    f"{'FN':<10}"
)


for threshold in thresholds:

    threshold_predictions = (
        probabilities >= threshold
    ).astype(int)


    threshold_precision = precision_score(
        y_test,
        threshold_predictions,
        zero_division=0
    )


    threshold_recall = recall_score(
        y_test,
        threshold_predictions,
        zero_division=0
    )


    threshold_f1 = f1_score(
        y_test,
        threshold_predictions,
        zero_division=0
    )


    matrix = confusion_matrix(
        y_test,
        threshold_predictions
    )


    true_negatives = matrix[0][0]
    false_positives = matrix[0][1]
    false_negatives = matrix[1][0]
    true_positives = matrix[1][1]


    print(
        f"{threshold:<12.2f}"
        f"{threshold_precision:<12.4f}"
        f"{threshold_recall:<12.4f}"
        f"{threshold_f1:<12.4f}"
        f"{false_positives:<10}"
        f"{false_negatives:<10}"
    )


print("\n")


print("Feature Importance:")


feature_importance = pd.DataFrame({
    "feature": feature_columns,
    "importance": model.feature_importances_
})


feature_importance = feature_importance.sort_values(
    by="importance",
    ascending=False
)


print(
    feature_importance.head(15).to_string(
        index=False
    )
)


model_data = {
    "model": model,
    "features": feature_columns
}


joblib.dump(
    model_data,
    MODEL_PATH
)


print(
    f"\nModel saved as {MODEL_PATH}"
)


print(
    f"Features used: {len(feature_columns)}"
)


print("\nTraining completed successfully.")