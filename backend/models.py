from sqlalchemy import Column, Integer, String, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
  __tablename__ = "users"
  id = Column(Integer, primary_key=True, index=True)
  sub = Column(String, unique=True, index=True)
  email = Column(String, unique=True, index=True)
  name = Column(String)
  picture = Column(String)
  role = Column(String, default="vecino")

class Producto(Base):
  __tablename__ = "productos"
  id = Column(Integer, primary_key=True, index=True)
  nombre = Column(String)
  precio = Column(Float)

class Reporte(Base):
  __tablename__ = "reportes"
  id = Column(Integer, primary_key=True, index=True)
  descripcion = Column(String)
  imagen = Column(String)
  lat = Column(Float)
  lng = Column(Float)
  estado = Column(String, default="pendiente")

class PushToken(Base):
  __tablename__ = "push_tokens"
  id = Column(Integer, primary_key=True, index=True)
  token = Column(String, unique=True)
  user_id = Column(Integer, ForeignKey("users.id"))
