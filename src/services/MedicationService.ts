// src/services/MedicationService.ts

import { Medication } from '../types';

/**
 * @class MedicationService
 * @description Servicio para manejar las operaciones relacionadas con los medicamentos.
 *              En un entorno real, esto interactuaría con una API.
 */
class MedicationService {
  private medications: Medication[] = [
    { id: 'm1', name: 'Paracetamol 500mg' },
    { id: 'm2', name: 'Ibuprofeno 400mg' },
    { id: 'm3', name: 'Amoxicilina 250mg' },
    { id: 'm4', name: 'Omeprazol 20mg' },
  ];

  /**
   * @method getMedications
   * @description Simula la obtención de una lista de medicamentos.
   * @returns {Promise<Medication[]>} Una promesa que resuelve con la lista de medicamentos.
   */
  async getMedications(): Promise<Medication[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.medications);
      }, 500); // Simula un retraso de red
    });
  }
}

export const medicationService = new MedicationService();
