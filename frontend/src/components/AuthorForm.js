import React, { useState, useEffect } from 'react';
import { apiAuthors } from '../api/config';
import { TextField, Button, Paper, Typography, Grid } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';

const AuthorForm = ({ onAuthorCreated, editData, setEditData }) => {
    const [formData, setFormData] = useState({ full_name: '', email: '', bio: '' });

    useEffect(() => { if (editData) setFormData(editData); }, [editData]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editData) {
                await apiAuthors.put(`/authors/${editData.id}`, formData);
            } else {
                await apiAuthors.post('/authors', formData);
            }
            setFormData({ full_name: '', email: '', bio: '' });
            setEditData(null);
            onAuthorCreated();
            alert("Autor guardado.");
        } catch (error) { alert("Error al guardar autor."); }
    };

    return (
        <Paper sx={{ p: 3, mb: 4, borderLeft: '5px solid #2e7d32' }}>
            <Typography variant="h6" sx={{ mb: 2 }}>{editData ? 'Editar Autor' : 'Registrar Autor'}</Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                    <Grid item xs={12} md={6}><TextField fullWidth label="Nombre" value={formData.full_name} required onChange={(e) => setFormData({...formData, full_name: e.target.value})} /></Grid>
                    <Grid item xs={12} md={6}><TextField fullWidth label="Email" value={formData.email} required onChange={(e) => setFormData({...formData, email: e.target.value})} /></Grid>
                    <Grid item xs={12} md={9}><TextField fullWidth label="Bio" value={formData.bio} onChange={(e) => setFormData({...formData, bio: e.target.value})} /></Grid>
                    <Grid item xs={12} md={3}>
                        <Button fullWidth type="submit" variant="contained" color="success" sx={{ height: '56px' }}>
                            {editData ? 'Actualizar' : 'Añadir'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Paper>
    );
};

export default AuthorForm;