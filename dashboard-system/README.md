# FitchGroup Sustainability Dashboard

A full-stack web application for analyzing and predicting greenhouse gas emissions using Sustainable Fitch data.

## Quick Start

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL 14+ with pgvector extension
- Gemini API key (for RAG functionality)

### 1. Backend Setup

```bash
cd dashboard-system/backend

# Install dependencies
npm install

# Configure environment
cp .env.example .env
# Edit .env with your credentials:
# - Database connection details
# - Gemini API key
# - Port (default: 3001)

# Start development server
npm run dev
```

### 3. Frontend Setup

```bash
cd dashboard-system/frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:5173`

### RAG
- `POST /api/rag/query` - Ask questions using AI copilot
