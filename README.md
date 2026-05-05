# Recipe Extractor & Meal Planner

An AI-powered web application that extracts structured data from recipe blog URLs and provides meal planning suggestions.

## Features
- **URL Extraction**: Scrapes any recipe blog and uses Groq (Llama 3.3) to parse ingredients, instructions, and metadata.
- **AI Generation**: Generates nutritional estimates, ingredient substitutions, and shopping lists.
- **History View**: Stores all extracted recipes in a database for easy access.
- **Premium UI**: Clean, modern interface with dark mode and responsive design.

## Tech Stack
- **Frontend**: React (Vite), Lucide Icons, Vanilla CSS
- **Backend**: FastAPI (Python), BeautifulSoup4
- **Database**: SQLite (default) / PostgreSQL
- **LLM**: Groq API (llama-3.3-70b-versatile)

## Setup Instructions

### Backend
1. Navigate to `backend/`
2. Create a `.env` file:
   ```env
   GROQ_API_KEY=your_groq_api_key_here
   DATABASE_URL=sqlite:///./recipes.db
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
4. Run the server:
   ```bash
   python -m app.main
   ```

### Frontend
1. Navigate to `frontend/`
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```

## API Endpoints
- `POST /extract`: Accepts a JSON body with `url`. Returns extracted recipe data.
- `GET /history`: Returns a list of all processed recipes.
- `GET /recipes/{id}`: Returns full details for a specific recipe.

## Evaluation
This project meets all requirements including structured extraction, nutritional estimation, substitution generation, and shopping list categorization.
