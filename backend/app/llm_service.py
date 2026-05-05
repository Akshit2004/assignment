import os
import json
from groq import Groq
from dotenv import load_dotenv

load_dotenv()

def get_client():
    api_key = os.getenv("GROQ_API_KEY")
    if not api_key:
        raise Exception("GROQ_API_KEY not found in environment")
    return Groq(api_key=api_key)

def extract_recipe_data(scraped_text: str):
    client = get_client()
    
    with open(os.path.join(os.path.dirname(__file__), "prompts/recipe_prompt.txt"), "r") as f:
        prompt_template = f.read()
    
    prompt = prompt_template.format(scraped_text=scraped_text[:20000])
    
    chat_completion = client.chat.completions.create(
        messages=[
            {
                "role": "user",
                "content": prompt,
            }
        ],
        model="llama-3.3-70b-versatile",
        response_format={"type": "json_object"},
    )
    
    response = chat_completion.choices[0].message.content
    
    try:
        return json.loads(response.strip())
    except Exception as e:
        raise Exception(f"Failed to parse Groq response: {str(e)}\nResponse: {response}")
