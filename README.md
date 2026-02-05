**Actividad 3**
**Integrantes**
            SERGIO IVAN CONDO ZAMBRANO
            MARCO ANTONIO CHACON YEPEZ
            CARLOS ESTEBAN FERNANDEZ MANTILLA


**Sistema de Gestión Editorial - Microservicios**



Este proyecto implementa una arquitectura de microservicios para la gestión de autores y publicaciones, integrando dos ecosistemas tecnológicos distintos (**Python/FastAPI** y **PHP/Laravel**) con bases de datos independientes.

**Arquitectura y Patrones de Diseño**

El sistema se ha construido siguiendo principios de ingeniería de software para garantizar escalabilidad y mantenibilidad:

- **Separación de Responsabilidades (SoC):** Cada microservicio gestiona su propio dominio y base de datos (Autores en MySQL, Publicaciones en PostgreSQL).
- **Patrón Service Layer:** Los controladores no contienen lógica de negocio. Se delegó toda la responsabilidad a clases Service, facilitando la reutilización y pruebas.
- **Patrón DTO (Data Transfer Objects):** Uso de esquemas (Pydantic en Python y API Resources en Laravel) para filtrar y estructurar los datos enviados al cliente.
- **Inyección de Dependencias:** Utilizada para desacoplar las clases de sus dependencias externas (servicios de HTTP, modelos).

**Principios SOLID Aplicados**

1. **S (Single Responsibility):** Cada clase tiene una única razón para cambiar. Por ejemplo, BookService solo gestiona la persistencia y validación de libros.
1. **O (Open/Closed):** El sistema permite extender funcionalidades (como añadir nuevos estados editorial) sin modificar el núcleo de la lógica.
1. **D (Dependency Inversion):** Los controladores dependen de abstracciones (Servicios) y no de implementaciones concretas.
-----
**Tecnologías y Puertos**

|Servicio|Tecnología|Base de Datos|Puerto Host|
| :- | :- | :- | :- |
|**Autores API**|Python / FastAPI|MySQL 8.0|8000|
|**Publicaciones API**|PHP 10 / Laravel|PostgreSQL 15|8001|
|**Base de Datos Autores**|MySQL|-|3306|
|**Base de Datos Libros**|PostgreSQL|-|5432|

Exportar a Hojas de cálculo

-----
**Instrucciones de Despliegue con Docker**

**1. Clonar y Estructurar**

Asegúrese de que el archivo docker-compose.yml esté en la raíz:

Bash

Actividad\_3/

├── docker-compose.yml

├── laravel-app/ (Microservicio Publicaciones)

└── python-app/  (Microservicio Autores)

**2. Levantar Contenedores**

Bash

docker-compose up --build -d

**3. Configuración Post-Instalación**

Ejecute los siguientes comandos para preparar las bases de datos:

Bash

\# Laravel: Instalar dependencias y Migraciones

docker-compose exec laravel\_api composer install

docker-compose exec laravel\_api php artisan key:generate

docker-compose exec laravel\_api php artisan migrate

\# Python: Las tablas se crean automáticamente al iniciar el contenedor

-----
**Implementación Técnica Destacada**

**Patrón DTO (Python - Pydantic)**

Se utilizan clases para validar la entrada y salida de datos, protegiendo la integridad de la API.

Python

class AuthorResponse(BaseModel):

`    `id: int

`    `full\_name: str

`    `bio: Optional[str] = None



`    `class Config:

`        `from\_attributes = True # Implementación de mapeo de objetos

**Integración de Microservicios (Laravel Service)**

El BookService actúa como cliente HTTP para validar la existencia del autor en el otro microservicio antes de permitir el registro en PostgreSQL.

PHP

public function createBookWithAuthorValidation(array $data)

{

`    `// Validación externa vía HTTP

`    `$this->validateAuthor($data['author\_id']); 

`    `return Book::create($data);

}

**Clases y Herencia**

En el microservicio de Python, se utilizan **clases base y derivadas** para la gestión de la base de datos (SQLAlchemy Base), permitiendo que todos los modelos hereden funcionalidades comunes de persistencia.

----- **Notas de Uso**
- **ISBN:** La columna ISBN en PostgreSQL tiene una restricción de unicidad.
- **Estados:** Los estados siguen un flujo BPMN: DRAFT, INREVIEW, APPROVED, PUBLISHED, REJECTED.
- **Cruce de Datos:** Laravel consume el endpoint /authors de Python para mostrar los nombres de los autores en la lista de publicaciones.

**Inventario de Endpoints y Rutas**

El sistema se comunica de forma híbrida: el **Frontend** consume ambos microservicios, mientras que el **Microservicio de Publicaciones** realiza peticiones *Server-to-Server* al **Microservicio de Autores**.

**Microservicio: Autores (FastAPI - Puerto 8000)**

Gestiona la persistencia de autores en MySQL.

|**Método**|**Ruta**|**Descripción**|**Parámetros (JSON)**|
| :- | :- | :- | :- |
|**GET**|/authors|Lista todos los autores|-|
|**GET**|/authors/{id}|Obtiene detalle de un autor|id (path)|
|**POST**|/authors|Registra un nuevo autor|full\_name, email, bio|
|**PUT**|/authors/{id}|Actualiza datos de autor|full\_name, email, bio|
|**DELETE**|/authors/{id}|Elimina un autor|id (path)|

**Microservicio: Publicaciones (Laravel - Puerto 8001)**

Gestiona libros en PostgreSQL con validación cruzada.

|**Método**|**Ruta**|**Descripción**|**Parámetros (JSON)**|
| :- | :- | :- | :- |
|**GET**|/api/books|Lista libros (incluye nombre de autor vía Python)|-|
|**POST**|/api/books|Crea libro (Valida author\_id vía HTTP)|title, isbn, author\_id, status|
|**PUT**|/api/books/{id}|Actualiza libro y estado|title, content, status|
|**DELETE**|/api/books/{id}|Elimina registro en PostgreSQL|id (path)|

-----
**Flujo de Integración entre Microservicios**

Para cumplir con el requerimiento de no usar directamente el controlador y mantener la integridad referencial lógica, el flujo de una petición POST /api/books es el siguiente:

1. **Controller:** Recibe el Request y lo transfiere al BookService.
1. **Service:** Extrae el author\_id y realiza una petición interna GET http://api\_python:8000/authors/{id}.
1. **Validation:** \* Si Python responde **200 OK**, el Service procede a guardar en PostgreSQL.
   1. Si Python responde **404 Not Found**, el Service lanza una Exception que el controlador traduce en un error para el cliente.
1. **Response:** El Service devuelve un **DTO** (Resource) con la información procesada.
Ejecución en Docker
Para ejecutar el ecosistema completo de microservicios sin necesidad de instalar PHP, Python o Node localmente, siga estos pasos: 
Requisitos Previos:
            Tener instalado Docker Desktop y Docker Compose.
            Asegurarse de que los puertos 8000, 8001, 3000, 3306 y 5432 estén libres en el host.
            Estructura de Archivos:
            Asegúrese de que el proyecto mantenga la siguiente jerarquía de carpetas: 

Ejecución del Proyecto
Abra una terminal en la carpeta raíz (/Actividad_3) y ejecute el siguiente comando:

docker-compose up --build

Nota: El flag --build garantiza que Docker construya las imágenes con los cambios más recientes en el código.
Acceso a los Servicios Una vez que la terminal indique que los contenedores están "Running",podrá acceder a:
Servicio URL Local Puerto Interno Frontend (React) 
            http://localhost:3000 3000 API Autores (Python) 
            http://localhost:8000 8000 API
Publicaciones (Laravel) http://localhost:8001 8001
