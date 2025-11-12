from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session
from fpdf import FPDF
from database import get_db
from models import Reporte
import os

router = APIRouter(prefix="/pdf", tags=["pdf"])

@router.get("/reporte/{reporte_id}")
def generar_pdf(reporte_id: int, db: Session = Depends(get_db)):
    reporte = db.query(Reporte).filter(Reporte.id == reporte_id).first()
    if not reporte:
        raise HTTPException(status_code=404, detail="Reporte no encontrado")

    # Crear el PDF
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, txt=f"Reporte #{reporte.id}", ln=True, align="C")
    pdf.multi_cell(0, 10, f"Descripción: {reporte.descripcion}")
    pdf.cell(0, 10, f"Ubicación: {reporte.lat}, {reporte.lng}", ln=True)
    pdf.cell(0, 10, f"Estado: {reporte.estado}", ln=True)

    # Guardar el archivo localmente
    os.makedirs("uploads", exist_ok=True)
    file_path = f"uploads/reporte_{reporte.id}.pdf"
    pdf.output(file_path)

    # Devolver el PDF al frontend
    return FileResponse(
        file_path,
        media_type="application/pdf",
        filename=f"reporte_{reporte.id}.pdf"
    )
