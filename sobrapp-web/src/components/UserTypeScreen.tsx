import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Container } from '@mui/material';
import Grid from '@mui/material/Grid2';
import { motion } from 'framer-motion';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import PersonIcon from '@mui/icons-material/Person';

const UserTypeScreen: React.FC = () => {
  const navigate = useNavigate();

  const handleUserTypeSelect = (userType: 'client' | 'driver') => {
    navigate('/register', { state: { userType } });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography variant="h2" component="h1" sx={{ fontWeight: 'bold', mb: 2, color: 'primary.main' }}>
              Sobrapp
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Typography variant="h5" component="h2" sx={{ mb: 4, color: 'text.secondary' }}>
              Plataforma de Entregas
            </Typography>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Typography variant="body1" sx={{ mb: 6, color: 'text.secondary', maxWidth: 600, mx: 'auto' }}>
              Conectamos personas que necesitan enviar sobres con motociclistas disponibles para realizar entregas de manera rápida y segura.
            </Typography>
          </motion.div>
        </Box>

        {/* User Type Selection */}
        <Grid container spacing={4} justifyContent="center">
          <Grid xs={12} sm={6} md={5}>
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => handleUserTypeSelect('client')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.0 }}
                  >
                    <PersonIcon sx={{ fontSize: 80, color: 'primary.main', mb: 3 }} />
                  </motion.div>
                  <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Cliente
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    Necesitas enviar un sobre o documento de manera rápida y segura.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold'
                    }}
                  >
                    Soy Cliente
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          <Grid xs={12} sm={6} md={5}>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 1.0 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Card 
                sx={{ 
                  height: '100%', 
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  '&:hover': {
                    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
                    transform: 'translateY(-4px)'
                  }
                }}
                onClick={() => handleUserTypeSelect('driver')}
              >
                <CardContent sx={{ p: 4, textAlign: 'center' }}>
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.2 }}
                  >
                    <LocalShippingIcon sx={{ fontSize: 80, color: 'secondary.main', mb: 3 }} />
                  </motion.div>
                  <Typography variant="h4" component="h3" sx={{ fontWeight: 'bold', mb: 2 }}>
                    Motociclista
                  </Typography>
                  <Typography variant="body1" sx={{ mb: 3, color: 'text.secondary' }}>
                    Quieres ganar dinero realizando entregas de manera flexible.
                  </Typography>
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    sx={{
                      py: 1.5,
                      fontSize: '1.1rem',
                      fontWeight: 'bold',
                      backgroundColor: 'secondary.main',
                      '&:hover': {
                        backgroundColor: 'secondary.dark'
                      }
                    }}
                  >
                    Soy Motociclista
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 1.4 }}
        >
          <Box sx={{ textAlign: 'center', mt: 6 }}>
            <Typography variant="body2" color="text.secondary">
              ¿Ya tienes una cuenta?{' '}
              <Button
                variant="text"
                onClick={() => navigate('/login')}
                sx={{ textTransform: 'none', fontWeight: 'bold' }}
              >
                Iniciar sesión
              </Button>
            </Typography>
          </Box>
        </motion.div>
      </motion.div>
    </Container>
  );
};

export default UserTypeScreen; 