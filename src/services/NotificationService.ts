// src/services/NotificationService.ts

import { INCOMPATIBLE_MEDS } from '../utils/constants';

// Tipos para las notificaciones y el callback de suscripción.
export type NotificationType = 'interaction' | 'dose';
export type NotificationCallback = (type: NotificationType, message: string) => void;

/**
 * Servicio singleton para manejar la lógica de notificaciones de medicación.
 * Simula la detección de interacciones y la programación de dosis.
 */
class NotificationService {
  private static instance: NotificationService;
  private subscribers: NotificationCallback[] = [];

  private constructor() {
    // Constructor privado para asegurar que solo exista una instancia (Singleton).
  }

  /**
   * Obtiene la única instancia del NotificationService.
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Suscribe un callback para recibir notificaciones.
   * @param callback La función a llamar cuando se emite una notificación.
   */
  public subscribe(callback: NotificationCallback): void {
    this.subscribers.push(callback);
    console.log('Subscriptor añadido. Total:', this.subscribers.length);
  }

  /**
   * Desuscribe un callback para dejar de recibir notificaciones.
   * @param callback La función a remover de la lista de suscriptores.
   */
  public unsubscribe(callback: NotificationCallback): void {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
    console.log('Subscriptor removido. Total:', this.subscribers.length);
  }

  /**
   * Notifica a todos los suscriptores.
   * @param type El tipo de notificación ('interaction' o 'dose').
   * @param message El mensaje de la notificación.
   */
  private notifySubscribers(type: NotificationType, message: string): void {
    console.log(`Notificando a suscriptores: [${type}] ${message}`);
    this.subscribers.forEach(callback => callback(type, message));
  }

  /**
   * Simula la verificación de interacciones medicamentosas.
   * Escenario Gherkin: "Interacción de medicamentos detectada"
   * @param medicationList Una lista de medicamentos que el paciente está tomando.
   */
  public checkMedicationInteractions(medicationList: string[]): void {
    console.log('Verificando interacciones para:', medicationList);
    const lowerCaseMedList = medicationList.map(med => med.toLowerCase());
    const incompatibleMedLC = INCOMPATIBLE_MEDS.map(med => med.toLowerCase());

    // Simulación simple: si ambos medicamentos incompatibles están en la lista, se detecta una interacción.
    const hasMed1 = lowerCaseMedList.includes(incompatibleMedLC[0]);
    const hasMed2 = lowerCaseMedList.includes(incompatibleMedLC[1]);

    if (hasMed1 && hasMed2) {
      const message = `¡Alerta! Interacción detectada entre ${INCOMPATIBLE_MEDS[0]} y ${INCOMPATIBLE_MEDS[1]}. Consulta a tu médico.`;
      this.notifySubscribers('interaction', message);
    } else {
      console.log('No se detectaron interacciones peligrosas entre los medicamentos actuales.');
    }
  }

  /**
   * Simula la programación de una notificación de dosis.
   * Escenario Gherkin: "Notificación de dosis"
   * @param medicationName El nombre del medicamento para el cual se programa la dosis.
   * @param delayMs El retraso en milisegundos antes de que se dispare la notificación.
   */
  public scheduleDoseNotification(medicationName: string, delayMs: number): void {
    console.log(`Programando notificación de dosis para ${medicationName} en ${delayMs / 1000} segundos.`);
    setTimeout(() => {
      const message = `¡Es hora de tu dosis! Recuerda tomar ${medicationName}.`;
      this.notifySubscribers('dose', message);
      console.log(`Notificación de dosis disparada para ${medicationName}.`);
    }, delayMs);
  }
}

// Exporta la instancia única del servicio.
export const notificationService = NotificationService.getInstance();
