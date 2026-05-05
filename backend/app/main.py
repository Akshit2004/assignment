from fastapi import FastAPI, Depends, HTTPException, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List
import uvicorn

from . import models, schemas, database, scraper, llm_service
from .database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Recipe Extractor API")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/extract", response_model=schemas.Recipe)
def extract_recipe(request: schemas.ExtractRequest, db: Session = Depends(get_db)):
    # Check if recipe already exists
    existing_recipe = db.query(models.Recipe).filter(models.Recipe.url == str(request.url)).first()
    if existing_recipe:
        return existing_recipe
        
    try:
        # 1. Scrape
        scraped_text = scraper.scrape_recipe_page(str(request.url))
        
        # 2. Extract with LLM
        recipe_data = llm_service.extract_recipe_data(scraped_text)
        
        # 3. Save to DB
        new_recipe = models.Recipe(
            url=str(request.url),
            **recipe_data
        )
        db.add(new_recipe)
        db.commit()
        db.refresh(new_recipe)
        
        return new_recipe
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/history", response_model=List[schemas.Recipe])
def get_history(db: Session = Depends(get_db)):
    return db.query(models.Recipe).order_by(models.Recipe.created_at.desc()).all()

@app.get("/recipes/{recipe_id}", response_model=schemas.Recipe)
def get_recipe_details(recipe_id: int, db: Session = Depends(get_db)):
    recipe = db.query(models.Recipe).filter(models.Recipe.id == recipe_id).first()
    if not recipe:
        raise HTTPException(status_code=404, detail="Recipe not found")
    return recipe

if __name__ == "__main__":
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
