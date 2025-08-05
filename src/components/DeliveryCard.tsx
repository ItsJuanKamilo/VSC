import React from 'react';
import { 
  Card, 
  CardContent, 
  Typography, 
  Box, 
  Chip, 
  Avatar, 
  Divider,
  Button,
  CircularProgress
} from '@mui/material';
import { motion } from 'framer-motion';
import { Delivery } from '../types';
import { getStatusColor, getStatusText, getUrgencyColor, getUrgencyText } from '../services/deliveryService';

interface DeliveryCardProps {
  delivery: Delivery;
  showClientInfo?: boolean;
  showDriverInfo?: boolean;
  showActions?: boolean;
  onAccept?: (deliveryId: string) => void;
  onStart?: (deliveryId: string) => void;
  onComplete?: (deliveryId: string) => void;
  onNavigate?: (delivery: Delivery) => void;
  processingDelivery?: string | null;
  actionButtonText?: string;
  actionButtonVariant?: 'accept' | 'start' | 'complete' | 'navigate';
  showProgress?: boolean;
  progressValue?: number;
}

const DeliveryCard: React.FC<DeliveryCardProps> = ({
  delivery,
  showClientInfo = true,
  showDriverInfo = false,
  showActions = false,
  onAccept,
  onStart,
  onComplete,
  onNavigate,
  processingDelivery,
  actionButtonText,
  actionButtonVariant = 'accept',
  showProgress = false,
  progressValue = 0
}) => {
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleString('es-CO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(price);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'accepted':
        return '🚚';
      case 'in_progress':
        return '▶️';
      case 'completed':
        return '✅';
      default:
        return '📦';
    }
  };

  const handleAction = () => {
    if (processingDelivery === delivery.id) return;

    switch (actionButtonVariant) {
      case 'accept':
        onAccept?.(delivery.id);
        break;
      case 'start':
        onStart?.(delivery.id);
        break;
      case 'complete':
        onComplete?.(delivery.id);
        break;
      case 'navigate':
        onNavigate?.(delivery);
        break;
    }
  };

  const getActionButtonProps = () => {
    const isProcessing = processingDelivery === delivery.id;
    
    switch (actionButtonVariant) {
      case 'accept':
        return {
          text: isProcessing ? 'Aceptando...' : (actionButtonText || 'Aceptar Entrega'),
          color: '#4caf50',
          hoverColor: '#45a049',
          icon: isProcessing ? <CircularProgress size={20} /> : '🚚'
        };
      case 'start':
        return {
          text: isProcessing ? 'Iniciando...' : (actionButtonText || 'Iniciar Entrega'),
          color: '#ff9800',
          hoverColor: '#f57c00',
          icon: isProcessing ? <CircularProgress size={20} /> : '▶️'
        };
      case 'complete':
        return {
          text: isProcessing ? 'Completando...' : (actionButtonText || 'Completar Entrega'),
          color: '#4caf50',
          hoverColor: '#45a049',
          icon: isProcessing ? <CircularProgress size={20} /> : '✅'
        };
      case 'navigate':
        return {
          text: actionButtonText || 'Navegar',
          color: '#2196f3',
          hoverColor: '#1976d2',
          icon: '🧭',
          variant: 'outlined' as const
        };
      default:
        return {
          text: actionButtonText || 'Acción',
          color: '#1976d2',
          hoverColor: '#1565c0',
          icon: '⚡'
        };
    }
  };

  const buttonProps = getActionButtonProps();

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}>
              {showClientInfo && delivery.client ? delivery.client.name.charAt(0) : 'U'}
            </Avatar>
            <Box>
              {showClientInfo && delivery.client && (
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {delivery.client.name}
                </Typography>
              )}
              {showDriverInfo && delivery.driver && (
                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                  {delivery.driver.name}
                </Typography>
              )}
              <Typography variant="caption" color="text.secondary">
                {formatDate(delivery.created_at)}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
            <Chip
              label={getUrgencyText(delivery.urgency)}
              size="small"
              sx={{
                backgroundColor: getUrgencyColor(delivery.urgency),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Chip
              label={getStatusText(delivery.status)}
              size="small"
              icon={<span>{getStatusIcon(delivery.status)}</span>}
              sx={{
                backgroundColor: getStatusColor(delivery.status),
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>

        <Divider sx={{ my: 2 }} />

        {/* Route */}
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Origen:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {delivery.origin}
          </Typography>
          
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Destino:
          </Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>
            {delivery.destination}
          </Typography>
        </Box>

        {/* Description */}
        {delivery.description && (
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Descripción:
            </Typography>
            <Typography variant="body2">
              {delivery.description}
            </Typography>
          </Box>
        )}

        {/* Price */}
        <Box sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'primary.main' }}>
            {formatPrice(delivery.price)}
          </Typography>
        </Box>

        {/* Progress Bar */}
        {showProgress && delivery.status === 'in_progress' && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Progreso de la entrega:
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Box sx={{ flexGrow: 1 }}>
                <Box
                  sx={{
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: '#e0e0e0',
                    overflow: 'hidden'
                  }}
                >
                  <Box
                    sx={{
                      height: '100%',
                      backgroundColor: '#4caf50',
                      width: `${progressValue}%`,
                      transition: 'width 0.3s ease'
                    }}
                  />
                </Box>
              </Box>
              <Typography variant="caption" color="text.secondary">
                {progressValue}%
              </Typography>
            </Box>
          </Box>
        )}

        {/* Action Button */}
        {showActions && (
          <Button
            fullWidth
            variant={buttonProps.variant || 'contained'}
            onClick={handleAction}
            disabled={processingDelivery === delivery.id}
            startIcon={buttonProps.icon}
            sx={{
              backgroundColor: buttonProps.variant === 'outlined' ? 'transparent' : buttonProps.color,
              color: buttonProps.variant === 'outlined' ? buttonProps.color : 'white',
              borderColor: buttonProps.variant === 'outlined' ? buttonProps.color : 'transparent',
              '&:hover': {
                backgroundColor: buttonProps.variant === 'outlined' ? 'rgba(33, 150, 243, 0.04)' : buttonProps.hoverColor,
                borderColor: buttonProps.variant === 'outlined' ? buttonProps.hoverColor : 'transparent'
              }
            }}
          >
            {buttonProps.text}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default DeliveryCard; 