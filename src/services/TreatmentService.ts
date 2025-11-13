import { TreatmentStatus } from '../types/treatment';

/**
 * src/services/TreatmentService.ts
 * Servicio para simular la obtención del estado del tratamiento de un paciente.
 * En un entorno real, esto interactuaría con una API REST.
 */
class TreatmentService {
  /**
   * Simula la obtención del estado del tratamiento para un paciente.
   * La respuesta varía para simular los escenarios de Gherkin:
   * - Si patientId es 'patient123' o termina en un número par, simula cumplimiento alto.
   * - Si patientId es 'patient456' o termina en un número impar, simula dosis omitidas.
   * @param {string} patientId - El ID del paciente cuyo estado de tratamiento se desea obtener.
   * @returns {Promise<TreatmentStatus>} Una promesa que resuelve con el estado del tratamiento.
   */
  async getTreatmentStatus(patientId: string): Promise<TreatmentStatus> {
    console.log(`[TreatmentService] Simulando carga de estado para el paciente: ${patientId}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula diferentes escenarios basados en el patientId para testing
        if (patientId === 'patient123' || parseInt(patientId.slice(-1)) % 2 === 0) {
          // Escenario: Paciente cumple tratamiento (cumplimiento alto)
          resolve({
            complianceRate: 0.95, // 95% de cumplimiento
            missedDoses: 0,
          });
        } else {
          // Escenario: Paciente omite dosis (cumplimiento bajo, alerta)
          resolve({
            complianceRate: 0.50, // 50% de cumplimiento
            missedDoses: 3,
          });
        }
      }, 1500); // Retardo de 1.5 segundos para simular una llamada a la red
    });
  }
}

export default new TreatmentService();
