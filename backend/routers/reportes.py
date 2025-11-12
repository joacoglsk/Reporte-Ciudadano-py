from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import Reporte
from schemas import ReporteIn, ReporteOut, StatsOut
from typing import List
from auth0 import verify_jwt
import os
from fastapi.responses import FileResponse
from fpdf import FPDF

router = APIRouter(prefix="/reportes", tags=["Reportes"])

# === Listar todos los reportes ===
@router.get("", response_model=List[ReporteOut])
def listar(db: Session = Depends(get_db)):
    reportes = db.query(Reporte).all()
    return [
        ReporteOut(
            id=r.id,
            descripcion=r.descripcion,
            imagen=r.imagen,
            lat=r.lat,
            lng=r.lng,
            estado=r.estado
        )
        for r in reportes
    ]


# === Crear un nuevo reporte ===
@router.post("", response_model=ReporteOut)
def crear(body: ReporteIn, db: Session = Depends(get_db), user=Depends(verify_jwt)):
    nuevo = Reporte(
        descripcion=body.descripcion,
        imagen=body.imagen,
        lat=body.ubicacion["latitude"],
        lng=body.ubicacion["longitude"],
        estado="pendiente"
    )
    db.add(nuevo)
    db.commit()
    db.refresh(nuevo)
    return ReporteOut(
        id=nuevo.id,
        descripcion=nuevo.descripcion,
        imagen=nuevo.imagen,
        lat=nuevo.lat,
        lng=nuevo.lng,
        estado=nuevo.estado
    )


# === Marcar como resuelto (PUT) ===
@router.put("/{reporte_id}", response_model=ReporteOut)
def actualizar_estado(reporte_id: int, db: Session = Depends(get_db), user=Depends(verify_jwt)):
    reporte = db.query(Reporte).filter(Reporte.id == reporte_id).first()
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    reporte.estado = "resuelto"
    db.commit()
    db.refresh(reporte)
    return ReporteOut(
        id=reporte.id,
        descripcion=reporte.descripcion,
        imagen=reporte.imagen,
        lat=reporte.lat,
        lng=reporte.lng,
        estado=reporte.estado
    )


# === Eliminar un reporte ===
@router.delete("/{reporte_id}")
def eliminar_reporte(reporte_id: int, db: Session = Depends(get_db), user=Depends(verify_jwt)):
    reporte = db.query(Reporte).filter(Reporte.id == reporte_id).first()
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    db.delete(reporte)
    db.commit()
    return {"ok": True, "msg": "Reporte eliminado correctamente"}


# === Generar PDF ===
@router.get("/pdf/reporte/{reporte_id}")
def generar_pdf(reporte_id: int, db: Session = Depends(get_db)):
    reporte = db.query(Reporte).filter(Reporte.id == reporte_id).first()
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/reporte_{reporte.id}.pdf"

    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Reporte #{reporte.id}", ln=True, align="C")
    pdf.multi_cell(0, 10, f"Descripción: {reporte.descripcion}")
    pdf.cell(0, 10, f"Ubicación: {reporte.lat}, {reporte.lng}", ln=True)
    pdf.cell(0, 10, f"Estado: {reporte.estado}", ln=True)
    pdf.output(file_path)

    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"reporte_{reporte.id}.pdf"
    )


# === Estadísticas ===
@router.get("/stats", response_model=StatsOut)
def stats(db: Session = Depends(get_db)):
    total = db.query(Reporte).count()
    pendientes = db.query(Reporte).filter(Reporte.estado == "pendiente").count()
    resueltos = db.query(Reporte).filter(Reporte.estado == "resuelto").count()
    return StatsOut(total=total, pendientes=pendientes, resueltos=resueltos)
