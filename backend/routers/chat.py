from fastapi import APIRouter, Depends
from pydantic import BaseModel
from utils.ai_client import query_ai
from auth import get_current_user

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatIn(BaseModel):
  message:str

@router.post("/")
def chat(body: ChatIn, user=Depends(get_current_user)):
  return {"reply": query_ai(body.message)}
