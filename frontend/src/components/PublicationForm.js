import React, { useState, useEffect } from 'react';
import { apiBooks, apiAuthors } from '../api/config';
import { 
    TextField, 
    Button, 
    MenuItem, 
    Paper, 
    Typography, 
    Grid, 
    Box, 
    FormControl, 
    InputLabel, 
    Select 
} from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';

const PublicationForm = ({ onPublicationCreated, refreshAuthorsTrigger, editData, setEditData }) => {
    const [authors, setAuthors] = useState([]);
    const [formData, setFormData] = useState({
        title: '', 
        content: '', 
        isbn: '', 
        author_id: '', 
        status: 'DRAFT'
    });

    // Cargar autores desde el microservicio
    useEffect(() => {
        const fetchAuthors = async () => {
            try {
                const res = await apiAuthors.get('/authors');
                setAuthors(Array.isArray(res.data) ? res.data : []);
            } catch (err) {
                console.error("Error al obtener autores:", err);
            }
        };
        fetchAuthors();
        
        if (editData) {
            setFormData(editData);
        }
    }, [editData, refreshAuthorsTrigger]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await apiBooks.put(`/books/${editData.id}`, formData);
            } else {
                await apiBooks.post('/books', formData);
            }
            // Resetear formulario
            setFormData({ title: '', content: '', isbn: '', author_id: '', status: 'DRAFT' });
            setEditData(null);
            onPublicationCreated();
            alert("¡Operación exitosa!");
        } catch (error) {
            console.error("Error al guardar:", error);
            alert("Error al guardar la publicación. Verifique el ISBN.");
        }
    };

    return (
        <Paper sx={{ p: 4, mb: 4, borderLeft: '6px solid #2e7d32', borderRadius: 2, boxShadow: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, color: '#2e7d32', fontWeight: 'bold' }}>
                {editData ? 'Modificar Publicación' : 'Nueva Publicación Editorial'}
            </Typography>
            
            <form onSubmit={handleSubmit}>
                <Grid container spacing={5}>
                    
                    {/* Fila 1: Autor + Estado + ISBN */}
                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth variant="standard" required>
                            <InputLabel id="author-select-label">Autor</InputLabel>
                            <Select
                                labelId="author-select-label"
                                id="author-select"
                                value={formData.author_id || ''}
                                label="Autor"
                                onChange={(e) => setFormData({ ...formData, author_id: e.target.value })}
                            >
                                {authors.length > 0 ? (
                                    authors.map((a) => (
                                        <MenuItem key={a.id} value={a.id}>
                                            {a.full_name}
                                        </MenuItem>
                                    ))
                                ) : (
                                    <MenuItem disabled>Cargando autores disponibles...</MenuItem>
                                )}
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <FormControl fullWidth variant="outlined" required>
                            <InputLabel id="status-select-label">Estado de Publicación</InputLabel>
                            <Select
                                labelId="status-select-label"
                                label="Estado de Publicación"
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                            >
                                <MenuItem value="DRAFT">Borrador</MenuItem>
                                <MenuItem value="INREVIEW">En Revisión</MenuItem>
                                <MenuItem value="APPROVED">Aprobada</MenuItem>
                                <MenuItem value="PUBLISHED">Publicada</MenuItem>
                                <MenuItem value="REJECTED">Rechazada</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>

                    <Grid item xs={12} sm={6} md={4}>
                        <TextField 
                            fullWidth 
                            label="Código ISBN *" 
                            variant="outlined" 
                            required
                            value={formData.isbn} 
                            onChange={(e) => setFormData({ ...formData, isbn: e.target.value })} 
                        />
                    </Grid>

                    {/* Fila 2: Título (ocupa todo el ancho) */}
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth 
                            label="Título de la Publicación *" 
                            variant="outlined" 
                            required
                            value={formData.title} 
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })} 
                        />
                    </Grid>

                    {/* Fila 3: Sinopsis (ocupa todo el ancho) */}
                    <Grid item xs={12}>
                        <TextField 
                            fullWidth 
                            label="Resumen o Sinopsis *" 
                            variant="outlined" 
                            required
                            multiline
                            rows={4}
                            value={formData.content} 
                            onChange={(e) => setFormData({ ...formData, content: e.target.value })} 
                        />
                    </Grid>

                    {/* Botón de Guardado */}
                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                            <Button 
                                type="submit" 
                                variant="contained" 
                                color="success" 
                                size="large" 
                                startIcon={<SaveIcon />}
                                sx={{ minWidth: 220, px: 6, py: 1.5, fontWeight: 'bold' }}
                            >
                                {editData ? 'ACTUALIZAR CAMBIOS' : 'GUARDAR PUBLICACIÓN'}
                            </Button>
                        </Box>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default PublicationForm;