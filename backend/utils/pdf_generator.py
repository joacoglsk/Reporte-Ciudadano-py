from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas

def make_pdf(reporte, serie):
  path = f"uploads/report_{reporte.id}_{serie}.pdf"
  c = canvas.Canvas(path, pagesize=letter)
  c.drawString(100, 700, f"Reporte #{reporte.id}")
  c.drawString(100, 680, f"Número: {serie}")
  c.drawString(100, 660, f"Descripción: {reporte.descripcion}")
  c.drawString(100, 640, f"Ubicación: {reporte.lat}, {reporte.lng}")
  c.save()
  return path
