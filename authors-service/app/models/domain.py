from abc import ABC, abstractmethod

# Clase Abstracta
class BasePerson(ABC):
    def __init__(self, full_name: str, email: str):
        self.full_name = full_name
        self.email = email

    @abstractmethod
    def get_role_description(self) -> str:
        pass

# Clase Derivada
class Author(BasePerson):
    def __init__(self, full_name: str, email: str, bio: str = ""):
        super().__init__(full_name, email)
        self.bio = bio

    def get_role_description(self) -> str:
        return f"Autor Editorial: {self.full_name}"