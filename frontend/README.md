# Frontend - Portal de Gestión Bibliográfica

Este módulo constituye la interfaz de usuario del ecosistema de microservicios. Está desarrollado en **React** y diseñado para ofrecer una gestión fluida de libros y autores mediante el consumo de APIs REST.

## Stack Tecnológico
* **Biblioteca:** React 18
* **Gestión de Estado:** Hooks (useState, useEffect)
* **Comunicación:** Fetch API / Axios
* **Entorno:** Dockerizado (Node.js Alpine)

## Integración de Servicios
El frontend actúa como un orquestador visual que consume datos de dos fuentes distintas:

1.  **Servicio de Publicaciones (Laravel/Postgres):** Puerto `8001` - Gestión de libros y lógica de negocio.
2.  **Servicio de Autores (FastAPI/MySQL):** Puerto `8000` - Gestión de perfiles y biografías.



## Funcionalidades Clave
* **Visualización Unificada:** Listado de libros que muestra información "hidratada" desde ambos microservicios.
* **Gestión de Autores:** Soporte para creación y edición técnica mediante métodos **PUT** (reemplazo total) y **PATCH** (actualización de campos específicos como biografía).
* **Validación de Integridad:** Manejo de respuestas `404 Not Found` cuando se intenta asociar un libro a un ID de autor inexistente.

## Despliegue con Docker
Para levantar este módulo de forma aislada (requiere que los backends estén activos):

1.  Construir la imagen: `docker build -t frontend-app .`
2.  Ejecutar contenedor: `docker run -p 3000:3000 frontend-app`

*Nota: En el entorno de producción/desarrollo general, este proceso es automatizado por el `docker-compose.yml` de la raíz.*

---
**Desarrollado para el Informe de Actividad 3 - Arquitectura de Microservicios Políglotas.**
