from pydantic import BaseModel
from typing import Optional, List, Dict

class UserOut(BaseModel):
  id:int; email:str; name:Optional[str]; picture:Optional[str]; role:str
  class Config: from_attributes=True

class ProductoIn(BaseModel):
  nombre:str; precio:float
class ProductoOut(ProductoIn):
  id:int
  class Config: from_attributes=True

class ReporteIn(BaseModel):
  descripcion:str
  imagen:Optional[str]=None
  ubicacion:Dict[str,float]
class ReporteOut(BaseModel):
  id:int; descripcion:str; imagen:Optional[str]; lat:float; lng:float; estado:str
  class Config: from_attributes=True

class StatsOut(BaseModel):
  total:int; pendientes:int; resueltos:int

class SyncIn(BaseModel):
  sub:str; email:str; name:Optional[str]=None; picture:Optional[str]=None

class PushIn(BaseModel):
  token:str
