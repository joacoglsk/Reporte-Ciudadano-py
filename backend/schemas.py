from pydantic import BaseModel
from typing import Optional, Dict

# === Usuarios ===
class UserOut(BaseModel):
    id: int
    email: str
    name: Optional[str]
    picture: Optional[str]
    role: str

    class Config:
        from_attributes = True


# === Productos ===
class ProductoIn(BaseModel):
    nombre: str
    precio: float


class ProductoOut(ProductoIn):
    id: int

    class Config:
        from_attributes = True


# === Reportes ===
class ReporteIn(BaseModel):
    descripcion: str
    imagen: Optional[str] = None
    ubicacion: Dict[str, float]  # 👈 cambia esto en lugar de latitud/longitud


class ReporteOut(BaseModel):
    id: int
    descripcion: str
    imagen: Optional[str]
    lat: float
    lng: float
    estado: str

    class Config:
        from_attributes = True


# === Estadísticas ===
class StatsOut(BaseModel):
    total: int
    pendientes: int
    resueltos: int


# === Sincronización Auth0 ===
class SyncIn(BaseModel):
    sub: str
    email: str
    name: Optional[str] = None
    picture: Optional[str] = None


# === Push Notifications ===
class PushIn(BaseModel):
    token: str

