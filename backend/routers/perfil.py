from fastapi import APIRouter, Depends, UploadFile, File
from sqlalchemy.orm import Session
from database import get_db
from models import User
from schemas import UserOut, SyncIn
import os, uuid, shutil

router = APIRouter(prefix="/perfil", tags=["perfil"])

@router.post("/sync", response_model=UserOut)
def sync_user(payload: SyncIn, db: Session = Depends(get_db)):
  u = db.query(User).filter(User.sub == payload.sub).first()
  if not u:
    u = User(sub=payload.sub, email=payload.email, name=payload.name, picture=payload.picture, role="vecino")
    db.add(u); db.commit(); db.refresh(u)
  else:
    u.name = payload.name or u.name
    u.picture = payload.picture or u.picture
    db.commit()
  return u

@router.post("/foto")
def upload_foto(file: UploadFile = File(...)):
  os.makedirs("uploads", exist_ok=True)
  fn = f"{uuid.uuid4()}.jpg"; path = os.path.join("uploads", fn)
  with open(path, "wb") as out: shutil.copyfileobj(file.file, out)
  return {"url": f"/{path}"}
