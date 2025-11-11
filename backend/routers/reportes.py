from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Reporte
from schemas import ReporteIn, ReporteOut, StatsOut
from typing import List
from auth import get_current_user

router = APIRouter(prefix="/reportes", tags=["reportes"])

@router.get("", response_model=List[ReporteOut])
def listar(db: Session = Depends(get_db)):
  rows = db.query(Reporte).all()
  return [ReporteOut(id=r.id, descripcion=r.descripcion, imagen=r.imagen, lat=r.lat, lng=r.lng, estado=r.estado) for r in rows]

@router.post("", response_model=ReporteOut)
def crear(body: ReporteIn, db: Session = Depends(get_db), user=Depends(get_current_user)):
  r = Reporte(descripcion=body.descripcion, imagen=body.imagen, lat=body.ubicacion["latitude"], lng=body.ubicacion["longitude"])
  db.add(r); db.commit(); db.refresh(r)
  return ReporteOut(id=r.id, descripcion=r.descripcion, imagen=r.imagen, lat=r.lat, lng=r.lng, estado=r.estado)

@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
  total = db.query(Reporte).count()
  pendientes = db.query(Reporte).filter(Reporte.estado == "pendiente").count()
  resueltos = db.query(Reporte).filter(Reporte.estado == "resuelto").count()
  return StatsOut(total=total, pendientes=pendientes, resueltos=resueltos)
