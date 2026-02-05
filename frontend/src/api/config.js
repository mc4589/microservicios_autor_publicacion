import axios from 'axios';

// Instancia para FastAPI (Autores)
const apiAuthors = axios.create({
    baseURL: 'http://127.0.0.1:8000'
});

// Instancia para Laravel (Publicaciones)
const apiBooks = axios.create({
    baseURL: 'http://127.0.0.1:8001/api'
});

export { apiAuthors, apiBooks };