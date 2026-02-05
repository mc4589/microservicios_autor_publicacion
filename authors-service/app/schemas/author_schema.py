from pydantic import BaseModel, EmailStr
from typing import Optional

# DTO para crear (Entrada: nombres completos, email oblgatorios. bio es opcional)
class AuthorCreate(BaseModel):
    full_name: str
    email: EmailStr
    bio: Optional[str] = None

# DTO para actualización parcial (PATCH)
# Todos los campos son Optional para que el cliente pueda enviar solo uno
class AuthorUpdate(BaseModel):
    full_name: Optional[str] = None
    email: Optional[EmailStr] = None
    bio: Optional[str] = None

# DTO para respuesta (Salida)
class AuthorResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    bio: Optional[str] = None

    class Config:
        from_attributes = True