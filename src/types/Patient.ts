// src/types/Patient.ts

/**
 * @interface Patient
 * @description Define la estructura de datos para un paciente.
 * @property {string} id - Identificador único del paciente.
 * @property {string} name - Nombre completo del paciente.
 * @property {string} dateOfBirth - Fecha de nacimiento del paciente en formato string (ej. 'YYYY-MM-DD').
 * @property {string} medicalHistory - Historial médico relevante del paciente (puede ser una cadena de texto larga).
 */
export interface Patient {
  id: string; // Un ID único para cada paciente
  name: string;
  dateOfBirth: string; // Formato string para la fecha
  medicalHistory: string;
}
