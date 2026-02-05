import os
from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from app.models.entities import Base

# 1. Cargar las variables de entorno desde el archivo .env
load_dotenv()

# 2. Obtener las credenciales del entorno
USER = os.getenv("MYSQL_USER")
PASS = os.getenv("MYSQL_PASSWORD")
HOST = os.getenv("DB_HOST", "localhost")
PORT = os.getenv("DB_PORT", "3306")
DB_NAME = os.getenv("MYSQL_DATABASE")

# 3. Construir la URL de conexión (Dialecto: pymysql)
# Formato: mysql+pymysql://usuario:password@host:puerto/nombre_db
DATABASE_URL = f"mysql+pymysql://{USER}:{PASS}@{HOST}:{PORT}/{DB_NAME}"

# 4. Crear el motor de la base de datos (Engine)
engine = create_engine(
    DATABASE_URL,
    # El pool_pre_ping ayuda a reconectar si la conexión se pierde
    pool_pre_ping=True
)

# 5. Crear la fábrica de sesiones (SessionLocal)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    """
    Crea todas las tablas definidas en los modelos que heredan de 'Base'.
    Regla: Las tablas deben crearse desde el código, no manualmente.
    """
    try:
        # Aquí se mapean las entidades a la DB real
        Base.metadata.create_all(bind=engine)
        print("INFO: Tablas creadas exitosamente en MySQL.")
    except Exception as e:
        print(f"ERROR: No se pudieron crear las tablas: {e}")

def get_db():
    """
    Generador de sesiones para Inyección de Dependencias.
    Garantiza que la conexión se cierre después de cada petición REST.
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()