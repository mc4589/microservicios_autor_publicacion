from fastapi import FastAPI, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from fastapi.middleware.cors import CORSMiddleware 

# Importaciones internas
from app.core.database import init_db, get_db
from app.repositories.author_repository import AuthorRepository
from app.schemas.author_schema import AuthorCreate, AuthorResponse, AuthorUpdate

app = FastAPI(
    title="Authors Microservice",
    description="API para la gestión de autores - Proyecto Integrador",
    version="1.0.0"
)

# Configuración de CORS
origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def on_startup():
    init_db()

# --- ENDPOINTS ---

@app.get("/", tags=["Health Check"])
def read_root():
    return {"message": "Authors Service is running"}

@app.post("/authors", 
          response_model=AuthorResponse, 
          status_code=status.HTTP_201_CREATED,
          tags=["Authors"])
def create_author(author: AuthorCreate, db: Session = Depends(get_db)):
    repo = AuthorRepository(db)
    return repo.create(author.model_dump())

@app.get("/authors", 
         response_model=List[AuthorResponse], 
         tags=["Authors"])
def list_authors(db: Session = Depends(get_db)):
    repo = AuthorRepository(db)
    return repo.get_all()

# Método GET por ID 
@app.get("/authors/{author_id}", 
         response_model=AuthorResponse, 
         tags=["Authors"])
def read_author(author_id: int, db: Session = Depends(get_db)):
    repo = AuthorRepository(db)
    db_author = repo.get_by_id(author_id)
    if not db_author:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail=f"Autor con ID {author_id} no encontrado"
        )
    return db_author

# PUT (Actualización Total)
@app.put("/authors/{author_id}", 
         response_model=AuthorResponse, 
         tags=["Authors"])
def update_author(author_id: int, author: AuthorCreate, db: Session = Depends(get_db)):
    repo = AuthorRepository(db)
    db_author = repo.get_by_id(author_id)
    if not db_author:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Autor no encontrado"
        )
    return repo.update(author_id, author.model_dump())

# PATCH (Actualización Parcial)
@app.patch("/authors/{author_id}", 
           response_model=AuthorResponse, 
           tags=["Authors"])
def patch_author(author_id: int, author: AuthorUpdate, db: Session = Depends(get_db)):
    repo = AuthorRepository(db)
    db_author = repo.get_by_id(author_id)
    if not db_author:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Autor no encontrado"
        )
    
    # exclude_unset=True asegura que solo se procesen los campos enviados en el JSON
    update_data = author.model_dump(exclude_unset=True)
    return repo.update_partial(author_id, update_data)

@app.delete("/authors/{author_id}", 
            status_code=status.HTTP_204_NO_CONTENT, 
            tags=["Authors"])
def delete_author(author_id: int, db: Session = Depends(get_db)):
    repo = AuthorRepository(db)
    if not repo.delete(author_id):
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND, 
            detail="Autor no encontrado"
        )
    return None