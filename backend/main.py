from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from deps import init_db
from routers import productos, reportes, perfil, notificaciones, pdf, chat
from fastapi.staticfiles import StaticFiles

app = FastAPI(title="Reporte Ciudadano API")
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
init_db()
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

app.include_router(perfil.router)
app.include_router(reportes.router)
app.include_router(productos.router)
app.include_router(notificaciones.router)
app.include_router(pdf.router)
app.include_router(chat.router)

@app.get("/")
def root():
    return {"ok": True}
