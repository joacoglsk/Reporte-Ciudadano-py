from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Reporte
from utils.pdf_generator import make_pdf
import uuid

router = APIRouter(prefix="/pdf", tags=["pdf"])

@router.get("/reporte/{report_id}")
def generar_pdf(report_id: int, db: Session = Depends(get_db)):
  r = db.query(Reporte).get(report_id)
  if not r: raise HTTPException(status_code=404, detail="No encontrado")
  serie = str(uuid.uuid4())[:8].upper()
  path = make_pdf(r, serie)
  return {"pdf_url": path}
