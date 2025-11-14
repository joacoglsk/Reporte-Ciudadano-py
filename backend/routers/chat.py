from fastapi import APIRouter, Depends
from pydantic import BaseModel
from utils.ai_client import query_ai
from auth0 import verify_jwt   # 👈 usar el mismo validador que reportes

router = APIRouter(prefix="/chat", tags=["chat"])

class ChatIn(BaseModel):
    message: str

@router.post("/")
def chat(body: ChatIn, user=Depends(verify_jwt)):  # 👈 CAMBIO CLAVE
    return {"reply": query_ai(body.message)}

