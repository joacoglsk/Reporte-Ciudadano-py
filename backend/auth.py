from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from sqlalchemy.orm import Session
from database import get_db
from models import User

security = HTTPBearer()

def get_current_user(creds: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)):
  token = creds.credentials
  try:
    payload = jwt.get_unverified_claims(token)
    sub = payload.get("sub")
    if not sub: raise Exception("no sub")
  except Exception:
    raise HTTPException(status_code=401, detail="Token inválido")
  user = db.query(User).filter(User.sub == sub).first()
  if not user: raise HTTPException(status_code=401, detail="Usuario no sincronizado")
  return user

def require_admin(user: User = Depends(get_current_user)):
  if user.role != "admin":
    raise HTTPException(status_code=403, detail="Solo admin")
  return user
