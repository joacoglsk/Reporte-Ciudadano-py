from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import PushToken
from schemas import PushIn
from auth import get_current_user

router = APIRouter(prefix="/notificaciones", tags=["notificaciones"])

@router.post("/token")
def guardar_token(payload: PushIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
  t = db.query(PushToken).filter(PushToken.token == payload.token).first()
  if not t:
    t = PushToken(token=payload.token, user_id=user.id)
    db.add(t); db.commit()
  return {"ok": True}
