# Cyber Incident Disclosure Tracker

A real-time intelligence platform for monitoring and analyzing cyber incident disclosures from SEC filings. This platform provides automated tracking, risk scoring, and AI-driven intelligence briefs for corporate governance and cybersecurity oversight.

## 🚀 Key Features

- **Automated Ingestion:** Scrapes and parses SEC EDGAR filings for cyber incident disclosures.
- **Intelligence Dashboard:** Interactive visualization of incident trends, sector exposure, and attack vectors.
- **Risk Scoring:** Quantitative assessment of incident materiality and organizational impact.
- **AI-Powered Analysis:** Automated generation of executive summaries and sector-specific intelligence briefs.
- **Data Export:** Support for CSV and JSON data exports for external analysis.

## 🏗️ Architecture

- **Frontend:** Next.js (TypeScript), Tailwind CSS, Lucide React, Recharts.
- **Backend:** FastAPI (Python), Pandas for data analysis.
- **Data Layer:** File-based sourcing (CSV/JSON/Parquet) for transparency and offline auditing.
- **Intelligence:** Hybrid approach combining rule-based insights with Large Language Model (LLM) integration.

## 🛠️ Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- (Optional) OpenAI or Anthropic API Key for cloud-based AI insights.

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Generate the dataset:
   ```bash
   python etl/generate_synthetic_data.py
   ```
5. Start the API server:
   ```bash
   uvicorn main:app --reload
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 Reports & Analysis

The platform automatically generates several key reports accessible via the API:

- **Executive Summary:** High-level overview of the current threat landscape.
- **Data Quality Report:** Assessment of dataset completeness and classification coverage.
- **Value at Risk (VAR) Brief:** Risk-weighted analysis of disclosed incidents.

## 📄 License

This project is licensed under the MIT License.
