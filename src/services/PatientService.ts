// src/services/PatientService.ts

import { Patient } from '../types';

/**
 * @class PatientService
 * @description Servicio para manejar las operaciones relacionadas con los pacientes.
 *              En un entorno real, esto interactuaría con una API.
 */
class PatientService {
  private patients: Patient[] = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
    { id: '3', name: 'Carlos López' },
  ];

  /**
   * @method getPatients
   * @description Simula la obtención de una lista de pacientes.
   * @returns {Promise<Patient[]>} Una promesa que resuelve con la lista de pacientes.
   */
  async getPatients(): Promise<Patient[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.patients);
      }, 500); // Simula un retraso de red
    });
  }
}

export const patientService = new PatientService();
