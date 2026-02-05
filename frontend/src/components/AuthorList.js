import React, { useState, useEffect } from 'react';
import { apiAuthors } from '../api/config';
import { 
    Button, 
    Typography, 
    Paper, 
    Stack, 
    Box, 
    IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';

const AuthorList = ({ onEdit, refreshTrigger }) => {
    const [authors, setAuthors] = useState([]);
    const [displayBio, setDisplayBio] = useState(false);
    const [currentBio, setCurrentBio] = useState('');

    useEffect(() => {
        fetchAuthors();
    }, [refreshTrigger]);

    const fetchAuthors = async () => {
        try {
            const response = await apiAuthors.get('/authors');
            setAuthors(Array.isArray(response.data) ? response.data : []);
        } catch (error) {
            console.error("Error al cargar autores:", error);
            setAuthors([]);
        }
    };

    const bioTemplate = (rowData) => (
        <Button 
            variant="text" 
            size="small"
            startIcon={<VisibilityIcon />} 
            onClick={() => { 
                setCurrentBio(rowData.bio); 
                setDisplayBio(true); 
            }}
        >
            Ver Biografía
        </Button>
    );

    const actionTemplate = (rowData) => (
        <Stack direction="row" spacing={1}>
            <Button 
                variant="outlined" 
                size="small" 
                startIcon={<EditIcon />} 
                onClick={() => onEdit(rowData)}
            >
                Editar
            </Button>
            <Button 
                variant="outlined" 
                color="error" 
                size="small" 
                startIcon={<DeleteIcon />} 
                onClick={() => { 
                    if(window.confirm("¿Está seguro de eliminar este autor?")) {
                        apiAuthors.delete(`/authors/${rowData.id}`).then(() => fetchAuthors());
                    }
                }}
            >
                Eliminar
            </Button>
        </Stack>
    );

    return (
        <Paper sx={{ p: 3, mt: 3, boxShadow: 3 }}>
            <Typography variant="h5" sx={{ mb: 2, color: '#2e7d32', fontWeight: 'bold' }}>
                Lista de Autores (MySQL)
            </Typography>
            
            <DataTable 
                value={authors} 
                paginator 
                rows={5} 
                responsiveLayout="scroll"
                emptyMessage="Sin registros" 
            >
                <Column field="id" header="ID" sortable />
                <Column field="full_name" header="Nombre" sortable />
                <Column field="email" header="Email" />
                <Column body={bioTemplate} header="Biografía" />
                <Column body={actionTemplate} header="Acciones" />
            </DataTable>

            {/* Modal para Biografía */}
            <Dialog 
                header="Detalles de Biografía" 
                visible={displayBio} 
                style={{ width: '30vw' }} 
                onHide={() => setDisplayBio(false)}
            >
                <Typography variant="body1" sx={{ mt: 2, whiteSpace: 'pre-wrap' }}>
                    {currentBio || "No hay biografía disponible para este autor."}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
                    <Button variant="contained" onClick={() => setDisplayBio(false)}>
                        Cerrar
                    </Button>
                </Box>
            </Dialog>
        </Paper>
    );
};

export default AuthorList;