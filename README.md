# Recipe Extractor & Meal Planner

An AI-powered web application that extracts structured data from recipe blog URLs and provides meal planning suggestions.

## Features
- **URL Extraction**: Scrapes any recipe blog and uses Groq (Llama 3.3) to parse ingredients, instructions, and metadata.
- **AI Generation**: Generates nutritional estimates, ingredient substitutions, and shopping lists.
- **History View**: Stores all extracted recipes in a database for easy access.
- **Premium UI**: Clean, modern interface with dark mode and responsive design.

## Screenshots

### Recipe Extraction (Tab 1)
![Recipe Extraction Page](./screenshots/frontend.png)

### History View (Tab 2)
![History View](./screenshots/History_view.png)

### Recipe Details Modal
![Details Modal](./screenshots/Detail_modal.png)

## Tech Stack
- **Frontend**: React (Vite), Lucide Icons, Vanilla CSS
- **Backend**: FastAPI (Python), BeautifulSoup4
- **Database**: SQLite (default) / PostgreSQL
- **LLM**: Groq API (llama-3.3-70b-versatile)

## Setup Instructions

Follow these steps to create the Python virtual environment, install dependencies, and run both backend and frontend locally.

Prerequisites: Python 3.10+, Node 16+/18+, npm, and `git` (optional).

### Create & activate a Python virtual environment
From the repository root (recommended):

- Windows (PowerShell):
  ```powershell
  python -m venv .venv
  Set-ExecutionPolicy -Scope Process -ExecutionPolicy RemoteSigned -Force
  .\.venv\Scripts\Activate.ps1
  ```

- Windows (cmd.exe):
  ```cmd
  python -m venv .venv
  .venv\Scripts\activate
  ```

- macOS / Linux:
  ```bash
  python3 -m venv .venv
  source .venv/bin/activate
  ```

After activating the virtual environment, upgrade pip and install backend dependencies.

### Backend (Python / FastAPI)
1. Change to the `backend/` folder:
   ```bash
   cd backend
   ```
2. Create a `.env` file in `backend/` (or set the env vars directly). Example contents:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   POSTGRES_USER=username
   POSTGRES_PASSWORD=your_password
   POSTGRES_DB=recipes_db
   POSTGRES_HOST=localhost
   POSTGRES_PORT=5432
   DATABASE_URL=postgresql://username:password@localhost:5432/recipes_db
   ```
3. Install Python dependencies:
   ```bash
   pip install --upgrade pip
   pip install -r requirements.txt
   ```
4. Run the backend API (choose one):

   - Run via Python module (uses the `if __name__ == "__main__"` uvicorn call):
     ```bash
     python -m app.main
     ```

   - Or run with uvicorn directly (recommended for development):
     ```bash
     uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
     ```

Notes:
- If you prefer starting from the repository root, ensure Python can import the `backend` package. From repo root you can run `PYTHONPATH=backend python -m app.main` (macOS/Linux) or `set PYTHONPATH=backend && python -m app.main` (Windows CMD / PowerShell variations).

### Frontend (Vite / React)
1. Open a new terminal, then change to the `frontend/` folder:
   ```bash
   cd frontend
   ```
2. Install Node dependencies:
   ```bash
   npm install
   ```
3. Run the dev server:
   ```bash
   npm run dev
   ```
4. Open the frontend in your browser (default Vite URL): `http://localhost:5173`


## API Endpoints
- `POST /extract`: Accepts a JSON body with `url`. Returns extracted recipe data.
- `GET /history`: Returns a list of all processed recipes.
- `GET /recipes/{id}`: Returns full details for a specific recipe.

## Project Structure
- **backend/**: FastAPI application, SQLAlchemy models, and LLM service.
- **frontend/**: React (Vite) application with premium styling.
- **prompts/**: LangChain-style prompt templates for extraction, nutrition, and substitutions.
- **sample_data/**: Example URLs and their corresponding JSON outputs for testing.
- **screenshots/**: Visual proof of the application in action.

## Prompts
The `prompts/` directory contains the AI instructions used to power the extraction:
- `recipe_extraction.txt`: The master prompt for structured data extraction.
- `nutrition_estimation.txt`: Specialized prompt for calorie and macro estimation.
- `substitution_generation.txt`: Prompt for smart ingredient swaps.

## Evaluation & Testing
To test the extraction:
1. Use the "Extract Recipe" tab.
2. Paste a URL from `sample_data/tested_urls.txt`.
3. Verify the structured output against the corresponding JSON in `sample_data/`.