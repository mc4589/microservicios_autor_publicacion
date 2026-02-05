import React, { useState } from 'react';
import { Container, Typography, Box, AppBar, Toolbar, CssBaseline, ThemeProvider, createTheme, Divider } from '@mui/material';
import AuthorList from './components/AuthorList';
import AuthorForm from './components/AuthorForm';
import PublicationList from './components/PublicationList';
import PublicationForm from './components/PublicationForm';

import "primereact/resources/themes/lara-light-indigo/theme.css";  
import "primereact/resources/primereact.min.css";                  
import "primeicons/primeicons.css";                                

const theme = createTheme({
  palette: {
    primary: { main: '#2e7d32' },
    secondary: { main: '#1976d2' },
  },
});

function App() {
  const [refreshAuthors, setRefreshAuthors] = useState(0);
  const [refreshBooks, setRefreshBooks] = useState(0);
  const [authorToEdit, setAuthorToEdit] = useState(null);
  const [bookToEdit, setBookToEdit] = useState(null);

  // Esta función refresca la lista de autores Y el selector del formulario de libros
  const handleAuthorCreated = () => {
    setRefreshAuthors(prev => prev + 1);
  };

  const handleBookCreated = () => setRefreshBooks(prev => prev + 1);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box sx={{ flexGrow: 1, backgroundColor: '#f4f6f8', minHeight: '100vh', pb: 5 }}>
        <AppBar position="static" sx={{ mb: 4 }}>
          <Toolbar>
            <Typography variant="h6">Sistema Distribuido: Gestión de Editorial</Typography>
          </Toolbar>
        </AppBar>

        <Container maxWidth="lg">
          <Typography variant="h3" align="center" gutterBottom sx={{ fontWeight: 'bold', mb: 4 }}>
            Panel de Control Microservicios
          </Typography>

          <Box sx={{ mb: 8 }}>
            <Typography variant="h4" gutterBottom color="primary">Módulo de Autores</Typography>
            <AuthorForm 
              onAuthorCreated={handleAuthorCreated} 
              editData={authorToEdit} 
              setEditData={setAuthorToEdit} 
            />
            <AuthorList 
                key={`auth-list-${refreshAuthors}`} 
                refreshTrigger={refreshAuthors}
                onEdit={setAuthorToEdit} 
            />
          </Box>

          <Divider sx={{ my: 5, borderBottomWidth: 2 }} />

          <Box>
            <Typography variant="h4" gutterBottom color="secondary">Módulo de Publicaciones</Typography>
            <PublicationForm 
              onPublicationCreated={handleBookCreated} 
              refreshAuthorsTrigger={refreshAuthors} // Sincroniza el selector
              editData={bookToEdit}
              setEditData={setBookToEdit}
            />
            <PublicationList 
              refreshTrigger={refreshBooks} 
              onEdit={setBookToEdit} 
            />
          </Box>
        </Container>
      </Box>
    </ThemeProvider>
  );
}

export default App;