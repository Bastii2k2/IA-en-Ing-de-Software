// src/types/index.ts

/**
 * @interface Patient
 * @description Define la estructura de un objeto paciente.
 */
export interface Patient {
  id: string;
  name: string;
}

/**
 * @interface Medication
 * @description Define la estructura de un objeto medicamento.
 */
export interface Medication {
  id: string;
  name: string;
}

/**
 * @interface MedicationPrescription
 * @description Define los detalles de un medicamento prescrito, incluyendo su ID temporal para manejo en UI.
 */
export interface MedicationPrescription {
  uiId: string; // ID único para la UI, no persistente
  medicationId: string;
  medicationName: string; // Para mostrar en el formulario
  dosage: string;
  instructions: string;
}

/**
 * @interface PrescriptionData
 * @description Define la estructura de los datos necesarios para generar una receta.
 */
export interface PrescriptionData {
  patientId: string;
  medications: Omit<MedicationPrescription, 'uiId' | 'medicationName'>[]; // Excluye uiId y medicationName para el servicio
}
