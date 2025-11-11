from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models import Producto
from schemas import ProductoIn, ProductoOut
from typing import List
from auth import require_admin

router = APIRouter(prefix="/productos", tags=["productos"])

@router.get("", response_model=List[ProductoOut])
def listar(db: Session = Depends(get_db)):
  return db.query(Producto).all()

@router.post("", response_model=ProductoOut)
def crear(p: ProductoIn, db: Session = Depends(get_db), user=Depends(require_admin)):
  obj = Producto(nombre=p.nombre, precio=p.precio)
  db.add(obj); db.commit(); db.refresh(obj); return obj

@router.put("/{pid}", response_model=ProductoOut)
def actualizar(pid:int, p: ProductoIn, db: Session = Depends(get_db), user=Depends(require_admin)):
  obj = db.query(Producto).get(pid)
  obj.nombre, obj.precio = p.nombre, p.precio
  db.commit(); db.refresh(obj); return obj

@router.delete("/{pid}")
def eliminar(pid:int, db: Session = Depends(get_db), user=Depends(require_admin)):
  obj = db.query(Producto).get(pid)
  db.delete(obj); db.commit(); return {"ok": True}
