# FinGuard AI

**AI-Powered Personal Finance & Fraud Detection Platform**

FinGuard AI is a full-stack personal finance application combining transaction management, financial analytics, machine-learning-based fraud detection, and Gemini-powered financial assistance.

## ✨ Features

- Add, view, edit, and delete transactions
- Track income, expenses, and balance
- Search, filter, and sort transactions
- Financial analytics dashboard
- Machine-learning-based fraud prediction
- Fraud probability and risk indicators
- Save fraud analysis results
- AI-generated financial insights
- AI financial assistant
- Persistent H2 database storage
- Responsive fintech-style UI

## 🏗️ Architecture

```text
                         ┌──────────────────────┐
                         │      React UI        │
                         │   Vite + TypeScript  │
                         └──────────┬───────────┘
                                    │
                                    ▼
                         ┌──────────────────────┐
                         │   Spring Boot API    │
                         │      Java + Maven    │
                         └───────┬───────┬──────┘
                                 │       │
                    ┌────────────┘       └──────────────┐
                    ▼                                   ▼
           ┌────────────────┐                 ┌─────────────────┐
           │   H2 Database  │                 │ Python ML API   │
           │ Persistent DB  │                 │ Flask + sklearn │
           └────────────────┘                 └────────┬────────┘
                                                       │
                                      ┌────────────────┴──────────────┐
                                      ▼                               ▼
                              ┌───────────────┐               ┌───────────────┐
                              │ Random Forest │               │    Gemini AI  │
                              │ Fraud Model   │               │ Insights +   │
                              └───────────────┘               │ Assistant    │
                                                             └───────────────┘
```

## 🛠️ Tech Stack

### Frontend
- React
- TypeScript
- Vite
- CSS

### Backend
- Java
- Spring Boot
- Spring Data JPA
- Maven
- H2 Database

### Machine Learning
- Python
- Flask
- pandas
- scikit-learn
- joblib
- Random Forest

### Generative AI
- Google Gemini API
- `google-genai`

## 📁 Project Structure

```text
finguard-ai/
├── backend/
├── frontend/
├── ml-service/
├── .gitignore
└── README.md
```

The backend contains the Spring Boot controllers, models, repository, and services. The frontend contains the React components and API service layer. The `ml-service` directory contains the Python ML/AI service.

> The local credit-card dataset used for ML training is excluded from Git tracking because of its size.

## 🔍 Fraud Detection

FinGuard AI uses a separate Python machine-learning service for fraud prediction.

```text
Transaction Features
        ↓
Spring Boot
        ↓
Python ML API
        ↓
Random Forest Model
        ↓
Fraud Prediction
        ↓
Fraud Probability
        ↓
React UI
```

The trained model is loaded by the Python service and exposed through a Flask API. The result contains the fraud prediction, probability, and risk indicators.

## 🤖 Gemini AI

FinGuard AI uses Gemini for two AI-powered features.

### AI Financial Insights

Transaction information is sent to the Python AI service, which uses Gemini to generate observations about the user's financial activity.

### AI Financial Assistant

Users can ask questions through the assistant while providing transaction context to the AI service.

```text
React
  ↓
Spring Boot
  ↓
Python AI Service
  ↓
Gemini
  ↓
AI Response
  ↓
React
```

## 🚀 Getting Started

### Prerequisites

Install:

- Node.js and npm
- Java
- Maven
- Python
- Git

A Gemini API key is required for the AI features.

### 1. Clone the Repository

```bash
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd finguard-ai
```

### 2. Start the Python ML Service

```bash
cd ml-service
```

Create a virtual environment.

**Windows:**
```bash
python -m venv venv
venv\Scripts\activate
```

**macOS/Linux:**
```bash
python3 -m venv venv
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Configure the Gemini API key using the environment variable expected by the Python service.

Start the service:

```bash
python app.py
```

The ML service runs on:

```text
http://localhost:5000
```

### 3. Start the Spring Boot Backend

Open another terminal:

```bash
cd backend
```

**Windows:**
```bash
mvnw.cmd spring-boot:run
```

**macOS/Linux:**
```bash
./mvnw spring-boot:run
```

The backend runs on:

```text
http://localhost:8080
```

H2 Console:

```text
http://localhost:8080/h2-console
```

### 4. Start the React Frontend

Open another terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on:

```text
http://localhost:5173
```

## 🔌 API Endpoints

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/transactions` | Add transaction |
| GET | `/api/transactions` | Get all transactions |
| GET | `/api/transactions/{id}` | Get transaction by ID |
| PUT | `/api/transactions/{id}` | Update transaction |
| DELETE | `/api/transactions/{id}` | Delete transaction |
| PUT | `/api/transactions/{id}/fraud-analysis` | Save fraud analysis |

### Fraud Detection

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/fraud/predict` | Predict fraud risk |

### AI

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/insights` | Generate AI financial insights |
| POST | `/api/assistant` | Ask the AI financial assistant |

## 🗄️ Database

FinGuard AI uses an H2 file-based database:

```text
jdbc:h2:file:./data/finguard
```

This allows transaction data to persist when the backend is restarted.

## 🔄 Application Flow

### Transaction Management

```text
User
 ↓
React Frontend
 ↓
Spring Boot REST API
 ↓
H2 Database
 ↓
Dashboard
```

### Fraud Detection

```text
Transaction
 ↓
Fraud Detection Lab
 ↓
Spring Boot
 ↓
Python ML Service
 ↓
Random Forest
 ↓
Fraud Probability
 ↓
Optional Save
```

### AI Insights

```text
Transactions
 ↓
AI Insights
 ↓
Spring Boot
 ↓
Python Service
 ↓
Gemini
 ↓
Generated Insights
```

## 🧪 Testing Checklist

The main end-to-end workflows have been tested:

- [x] Add transaction
- [x] Edit transaction
- [x] Delete transaction
- [x] Search transactions
- [x] Filter transactions
- [x] Sort transactions
- [x] Financial analytics
- [x] Fraud prediction
- [x] Save fraud analysis
- [x] AI financial insights
- [x] AI assistant
- [x] Transaction persistence after refresh
- [x] Frontend ↔ Backend communication
- [x] Backend ↔ Python ML service communication

## 🔐 Environment Variables

Do not commit API keys or other secrets to GitHub.

Example:

```text
GEMINI_API_KEY=your_api_key_here
```

Use the actual variable name configured in your Python service if it differs.

## 📌 Future Improvements

- User authentication and authorization
- Multiple user accounts
- PostgreSQL/MySQL production database
- Advanced fraud detection models
- Real-time transaction monitoring
- Budget planning and alerts
- Recurring transaction detection
- Investment portfolio tracking
- Financial goal planning
- Advanced AI-generated reports
- Cloud deployment
- Docker-based deployment
- Model monitoring and retraining

## 🎯 Project Objective

FinGuard AI demonstrates how modern full-stack development, machine learning, and generative AI can be combined into one practical financial application.

```text
Frontend Development
        +
Backend Development
        +
Database Management
        +
Machine Learning
        +
Generative AI
        =
FinGuard AI
```

## 👨‍💻 Author

**Priyanshu Sahoo**

NIT Rourkela — Electronics & Instrumentation Engineering

## 📄 License

This project is intended for educational and portfolio purposes.
