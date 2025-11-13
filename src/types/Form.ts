// src/types/Form.ts

import { Patient } from './Patient';

/**
 * @interface PatientFormData
 * @description Define la estructura de datos para el formulario de registro de pacientes.
 * Generalmente es similar a la interfaz Patient, pero sin el 'id' que se genera al guardar.
 */
export interface PatientFormData extends Omit<Patient, 'id'> {}

/**
 * @interface PatientFormErrors
 * @description Define la estructura para los errores de validación del formulario de registro de pacientes.
 * Las claves corresponden a los campos del formulario y los valores son los mensajes de error.
 */
export type PatientFormErrors = {
  [key in keyof PatientFormData]?: string;
};
