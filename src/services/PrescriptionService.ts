// src/services/PrescriptionService.ts

import { PrescriptionData } from '../types';
import { Alert } from 'react-native';

/**
 * @class PrescriptionService
 * @description Servicio para manejar la generación de recetas electrónicas.
 *              Incluye la lógica de validación de los escenarios Gherkin.
 */
class PrescriptionService {
  /**
   * @method generatePrescription
   * @description Simula la generación de una receta electrónica en formato PDF.
   *              Implementa los escenarios Gherkin para validación.
   * @param {PrescriptionData} prescriptionData - Los datos de la receta a generar.
   * @returns {Promise<string>} Una promesa que resuelve con un mensaje de éxito o rechaza con un mensaje de error.
   */
  async generatePrescription(prescriptionData: PrescriptionData): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Escenario Gherkin: Falta de datos (no se selecciona ningún medicamento)
        if (!prescriptionData.medications || prescriptionData.medications.length === 0) {
          Alert.alert('Error de validación', 'Debe seleccionar al menos un medicamento.');
          return reject('Debe seleccionar al menos un medicamento.');
        }

        // Validación adicional (aunque no explícita en Gherkin, es buena práctica)
        if (!prescriptionData.patientId) {
            Alert.alert('Error de validación', 'Debe seleccionar un paciente.');
            return reject('Debe seleccionar un paciente.');
        }

        // Verificar que todos los medicamentos tienen dosis e instrucciones
        const invalidMedication = prescriptionData.medications.find(med => !med.dosage || !med.instructions);
        if (invalidMedication) {
            Alert.alert('Error de validación', 'Todos los medicamentos deben tener dosis e instrucciones.');
            return reject('Todos los medicamentos deben tener dosis e instrucciones.');
        }

        // Escenario Gherkin: Receta generada correctamente
        const pdfContent = `
          RECETA ELECTRÓNICA
          -------------------
          Paciente ID: ${prescriptionData.patientId}
          Fecha: ${new Date().toLocaleDateString()}
          -------------------
          Medicamentos:
          ${prescriptionData.medications.map(med =>
            `- ID Medicamento: ${med.medicationId}
              Dosis: ${med.dosage}
              Instrucciones: ${med.instructions}`
          ).join('\n          ')}
          -------------------
          (Este es un PDF simulado)
        `;
        console.log('--- Contenido del PDF de la Receta Generada ---');
        console.log(pdfContent);
        console.log('-----------------------------------------------');
        Alert.alert('Éxito', 'Receta generada correctamente (simulando PDF).');
        resolve('Receta generada con éxito.');
      }, 1000); // Simula el tiempo de procesamiento de la generación de PDF
    });
  }
}

export const prescriptionService = new PrescriptionService();
