// src/services/AlertService.ts
/**
 * @file Servicio para mostrar alertas en la aplicación de forma consistente.
 */
import { Alert } from 'react-native';

class AlertService {
  /**
   * Muestra una alerta con un título y mensaje.
   * @param title Título de la alerta.
   * @param message Mensaje de la alerta.
   */
  public static show(title: string, message: string): void {
    Alert.alert(title, message);
  }
}

export default AlertService;
