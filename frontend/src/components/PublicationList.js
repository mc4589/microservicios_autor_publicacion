import React, { useState, useEffect } from 'react';
import { apiBooks } from '../api/config';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { 
    Button, Typography, Paper, Stack, Chip, Box, 
    Dialog, DialogTitle, DialogContent, DialogActions, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';

const PublicationList = ({ refreshTrigger, onEdit }) => {
    const [books, setBooks] = useState([]);
    const [openModal, setOpenModal] = useState(false);
    const [modalData, setModalData] = useState({ title: '', content: '' });

    // Traductor de estados para la tabla
    const statusConfig = {
        'DRAFT':     { label: 'Borrador',    color: 'default' },
        'INREVIEW':  { label: 'En Revisión', color: 'info'    },
        'APPROVED':  { label: 'Aprobada',    color: 'success' },
        'PUBLISHED': { label: 'Publicada',   color: 'primary' },
        'REJECTED':  { label: 'Rechazada',   color: 'error'   }
    };

    useEffect(() => {
        fetchBooks();
    }, [refreshTrigger]);

    const fetchBooks = async () => {
        try {
            const response = await apiBooks.get('/books');
            const data = response.data.data || response.data;
            setBooks(Array.isArray(data) ? data : []);
        } catch (err) { console.error("Error cargando tabla:", err); }
    };

    const showContent = (book) => {
        setModalData({ title: book.title, content: book.content });
        setOpenModal(true);
    };

    const statusTemplate = (rowData) => {
        const config = statusConfig[rowData.status] || { label: rowData.status, color: 'default' };
        return <Chip label={config.label} color={config.color} size="small" variant="outlined" sx={{fontWeight: 'bold'}} />;
    };

    const viewContentTemplate = (rowData) => (
        <Button size="small" startIcon={<VisibilityIcon />} onClick={() => showContent(rowData)}>
            Ver Contenido
        </Button>
    );

    const actionTemplate = (rowData) => (
        <Stack direction="row" spacing={1}>
            <IconButton color="primary" onClick={() => onEdit(rowData)} size="small"><EditIcon /></IconButton>
            <IconButton color="error" onClick={() => {
                if (window.confirm("¿Eliminar?")) apiBooks.delete(`/books/${rowData.id}`).then(() => fetchBooks());
            }} size="small"><DeleteIcon /></IconButton>
        </Stack>
    );

    return (
        <Paper sx={{ p: 3, mt: 3, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 3, color: '#1976d2', fontWeight: 'bold' }}>
                Publicaciones Registradas
            </Typography>

            <DataTable value={books} paginator rows={5} responsiveLayout="scroll">
                <Column field="id" header="ID" style={{ width: '5%' }} />
                <Column field="title" header="Título" style={{ width: '20%' }} />
                <Column field="author_name" header="Autor" style={{ width: '20%' }} />
                <Column field="isbn" header="ISBN" style={{ width: '15%' }} />
                <Column header="Contenido" body={viewContentTemplate} style={{ width: '15%' }} />
                <Column header="Estado" body={statusTemplate} style={{ width: '15%' }} />
                <Column header="Acciones" body={actionTemplate} style={{ width: '10%' }} />
            </DataTable>

            <Dialog open={openModal} onClose={() => setOpenModal(false)} fullWidth maxWidth="sm">
                <DialogTitle sx={{ bgcolor: '#f5f5f5' }}>Contenido: {modalData.title}</DialogTitle>
                <DialogContent sx={{ mt: 2 }}>
                    <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>{modalData.content}</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenModal(false)}>Cerrar</Button>
                </DialogActions>
            </Dialog>
        </Paper>
    );
};

export default PublicationList;