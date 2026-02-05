from sqlalchemy.orm import Session
from app.models.entities import AuthorEntity 

class AuthorRepository:
    def __init__(self, db: Session):
        self.db = db

    def get_all(self):
        return self.db.query(AuthorEntity).all()

    def get_by_id(self, author_id: int):
        return self.db.query(AuthorEntity).filter(AuthorEntity.id == author_id).first()

    def create(self, author_data: dict):
        db_author = AuthorEntity(**author_data)
        self.db.add(db_author)
        self.db.commit()
        self.db.refresh(db_author)
        return db_author

    # Usado para PUT (Reemplazo total)
    def update(self, author_id: int, author_data: dict):
        db_author = self.get_by_id(author_id)
        if db_author:
            for key, value in author_data.items():
                setattr(db_author, key, value)
            self.db.commit()
            self.db.refresh(db_author)
        return db_author

    # Usado para PATCH (Actualización parcial)
    def update_partial(self, author_id: int, author_data: dict):
        db_author = self.get_by_id(author_id)
        if db_author:
            # Aquí author_data solo trae los campos que el usuario envió
            for key, value in author_data.items():
                setattr(db_author, key, value)
            self.db.commit()
            self.db.refresh(db_author)
        return db_author

    def delete(self, author_id: int):
        db_author = self.get_by_id(author_id)
        if db_author:
            self.db.delete(db_author)
            self.db.commit()
            return True
        return False