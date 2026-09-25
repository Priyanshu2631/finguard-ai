import json
import os
import time

from flask import Flask, request, jsonify

from google import genai

from predict import predict_fraud


app = Flask(__name__)


@app.after_request
def add_cors_headers(response):

    response.headers["Access-Control-Allow-Origin"] = (
        "http://localhost:5173"
    )

    response.headers["Access-Control-Allow-Headers"] = (
        "Content-Type"
    )

    response.headers["Access-Control-Allow-Methods"] = (
        "GET, POST, OPTIONS"
    )

    return response


GEMINI_API_KEY = os.getenv("GEMINI_API_KEY")

if not GEMINI_API_KEY:
    raise ValueError(
        "GEMINI_API_KEY environment variable is not set."
    )


client = genai.Client(
    api_key=GEMINI_API_KEY
)

GEMINI_MODEL = "gemini-3.6-flash"


def get_error_code(error):

    error_message = str(error)

    if "429" in error_message:
        return 429

    if "503" in error_message:
        return 503

    return 500


def is_daily_quota_error(error):

    error_message = str(error).lower()

    return (
        "resource_exhausted" in error_message
        and (
            "daily" in error_message
            or "generaterequestsperday" in error_message
            or "free_tier_requests" in error_message
        )
    )


def generate_gemini_response(prompt):

    max_attempts = 3

    for attempt in range(max_attempts):

        try:

            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=prompt
            )

            if not response.text:
                raise RuntimeError(
                    "Gemini returned an empty response."
                )

            return response.text

        except Exception as error:

            error_message = str(error)
            error_code = get_error_code(error)

            print(
                f"Gemini attempt "
                f"{attempt + 1}/{max_attempts} failed:"
            )

            print(error_message)

            if (
                error_code == 429
                and is_daily_quota_error(error)
            ):

                print(
                    "Gemini daily quota exhausted. "
                    "Skipping retries."
                )

                raise

            if error_code == 503:

                if attempt < max_attempts - 1:

                    wait_time = 2 ** attempt

                    print(
                        f"Retrying Gemini in "
                        f"{wait_time} seconds..."
                    )

                    time.sleep(wait_time)

                    continue

                raise

            if error_code == 429:

                if attempt < max_attempts - 1:

                    wait_time = 2 ** attempt

                    print(
                        f"Gemini rate limit reached. "
                        f"Retrying in "
                        f"{wait_time} seconds..."
                    )

                    time.sleep(wait_time)

                    continue

                raise

            raise


def gemini_error_response(
    error,
    feature
):

    error_code = get_error_code(error)

    if (
        error_code == 429
        and is_daily_quota_error(error)
    ):

        message = (
            "Gemini daily quota has been reached. "
            "Please try again after the quota resets."
        )

        status_code = 429

    elif error_code == 503:

        message = (
            "Gemini is temporarily experiencing "
            "high demand. Please try again shortly."
        )

        status_code = 503

    elif error_code == 429:

        message = (
            "Gemini is temporarily rate limited. "
            "Please wait a moment and try again."
        )

        status_code = 429

    else:

        message = (
            f"Unable to generate {feature} right now."
        )

        status_code = 500

    return jsonify({
        "error": message,
        "feature": feature
    }), status_code


@app.route(
    "/health",
    methods=["GET"]
)
def health():

    return jsonify({
        "status": "ML service is running"
    })


@app.route(
    "/predict",
    methods=["POST", "OPTIONS"]
)
def predict():

    if request.method == "OPTIONS":

        return jsonify({
            "status": "CORS preflight successful"
        })

    data = request.json

    if not data:

        return jsonify({
            "error": "Request body is required."
        }), 400

    required_fields = [
        "time",
        "amount",
        "v1",
        "v2",
        "v3",
        "v4",
        "v5",
        "v6",
        "v7",
        "v8",
        "v9",
        "v10",
        "v11",
        "v12",
        "v13",
        "v14",
        "v15",
        "v16",
        "v17",
        "v18",
        "v19",
        "v20",
        "v21",
        "v22",
        "v23",
        "v24",
        "v25",
        "v26",
        "v27",
        "v28"
    ]

    missing_fields = [
        field
        for field in required_fields
        if field not in data
    ]

    if missing_fields:

        return jsonify({
            "error": "Missing required fields",
            "missing_fields": missing_fields
        }), 400

    result = predict_fraud(
        time=data["time"],
        amount=data["amount"],

        v1=data["v1"],
        v2=data["v2"],
        v3=data["v3"],
        v4=data["v4"],
        v5=data["v5"],
        v6=data["v6"],
        v7=data["v7"],
        v8=data["v8"],
        v9=data["v9"],
        v10=data["v10"],

        v11=data["v11"],
        v12=data["v12"],
        v13=data["v13"],
        v14=data["v14"],
        v15=data["v15"],
        v16=data["v16"],
        v17=data["v17"],
        v18=data["v18"],
        v19=data["v19"],
        v20=data["v20"],

        v21=data["v21"],
        v22=data["v22"],
        v23=data["v23"],
        v24=data["v24"],
        v25=data["v25"],
        v26=data["v26"],
        v27=data["v27"],
        v28=data["v28"]
    )

    return jsonify(result)


@app.route(
    "/assistant",
    methods=["POST"]
)
def assistant():

    data = request.json

    if not data:

        return jsonify({
            "error": "Request body is required."
        }), 400

    question = data.get(
        "question",
        ""
    ).strip()

    transactions = data.get(
        "transactions",
        []
    )

    if not question:

        return jsonify({
            "error": "Please enter a question."
        }), 400

    transaction_data = json.dumps(
        transactions,
        indent=2
    )

    prompt = f"""
You are FinGuard AI, a helpful personal
finance assistant.

Answer the user's financial question
using the transaction data provided below.

User question:
{question}

Transaction data:
{transaction_data}

Instructions:
- Give a clear and useful answer.
- Use the transaction data when relevant.
- Do not invent transaction information.
- Explain calculations when useful.
- Keep the response concise but informative.
- Use simple language.
- You can use bullet points when appropriate.
"""

    try:

        answer = generate_gemini_response(
            prompt
        )

        return jsonify({
            "answer": answer
        })

    except Exception as error:

        print(
            "Gemini Assistant Error:",
            error
        )

        return gemini_error_response(
            error,
            "AI Assistant response"
        )


@app.route(
    "/insights",
    methods=["POST"]
)
def insights():

    data = request.json

    if not data:

        return jsonify({
            "error": "Request body is required."
        }), 400

    transactions = data.get(
        "transactions",
        []
    )

    transaction_data = json.dumps(
        transactions,
        indent=2
    )

    prompt = f"""
You are FinGuard AI, a personal finance
analysis assistant.

Analyze the user's transaction history
and provide useful financial insights.

Transaction data:
{transaction_data}

Look for:
- Spending patterns
- Major spending categories
- Unusual spending
- Income versus expenses
- Potential areas where spending could be reduced
- Positive financial habits
- Useful observations about the transaction history

Instructions:
- Base your observations only on the transaction data provided.
- Do not invent transactions.
- Do not claim certainty when the data is insufficient.
- Keep the response concise.
- Use clear headings and bullet points.
- Make the insights practical and easy to understand.
"""

    try:

        insights_text = generate_gemini_response(
            prompt
        )

        return jsonify({
            "insights": insights_text
        })

    except Exception as error:

        print(
            "Gemini Insights Error:",
            error
        )

        return gemini_error_response(
            error,
            "financial insights"
        )


if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )