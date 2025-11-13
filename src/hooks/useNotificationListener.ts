// src/hooks/useNotificationListener.ts

import { useEffect } from 'react';
import { Alert } from 'react-native';
import { notificationService, NotificationType, NotificationCallback } from '../services/NotificationService';

/**
 * Hook personalizado para escuchar notificaciones del NotificationService
 * y mostrarlas como alertas de React Native.
 *
 * Este hook debe ser llamado dentro de un componente de React para que
 * se gestione correctamente la suscripción y desuscripción al servicio.
 */
export const useNotificationListener = () => {
  useEffect(() => {
    // Define el callback que se ejecutará cuando el servicio emita una notificación.
    const handleNotification: NotificationCallback = (type, message) => {
      let title = '';
      switch (type) {
        case 'interaction':
          title = '¡Alerta de Interacción Medicamentosa!';
          break;
        case 'dose':
          title = 'Recordatorio de Dosis';
          break;
        default:
          title = 'Notificación';
      }
      Alert.alert(title, message); // Muestra la alerta nativa de React Native.
    };

    // Suscribe el callback al servicio cuando el componente se monta.
    notificationService.subscribe(handleNotification);
    console.log('useNotificationListener: Suscrito al NotificationService.');

    // Función de limpieza para desuscribir el callback cuando el componente se desmonta.
    return () => {
      notificationService.unsubscribe(handleNotification);
      console.log('useNotificationListener: Desuscrito del NotificationService.');
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar y desmontar.
};
