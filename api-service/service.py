from fastapi import Depends,FastAPI
from starlette.middleware.cors import CORSMiddleware
from api import query_search
from typing import Dict
from pydantic import BaseModel

# Setup FastAPI app
app = FastAPI(
    title="API Server",
    description="API Server",
    version="v1"
)

class SentimentRequest(BaseModel):
    text: str

# Enable CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_credentials=False,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# Routes
@app.get("/")
async def get_index():
    return {
        "message": "Welcome to the API Service"
    }


@app.post("/find")
async def find_results(request: SentimentRequest):
    return(query_search.test(request.text))