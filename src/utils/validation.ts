// src/utils/validation.ts

import { PatientFormData } from '../types/Form';

/**
 * @function validatePatientForm
 * @description Realiza la validación de los datos del formulario de registro de pacientes.
 * @param {PatientFormData} formData - Los datos del formulario a validar.
 * @returns {PatientFormErrors} Un objeto con los mensajes de error para cada campo inválido.
 */
export const validatePatientForm = (formData: PatientFormData) => {
  const errors: { [key: string]: string } = {};

  // Validar nombre: requerido
  if (!formData.name.trim()) {
    errors.name = 'El nombre del paciente es obligatorio.';
  }

  // Validar fecha de nacimiento: requerida y formato básico (puede mejorarse con regex de fecha real)
  if (!formData.dateOfBirth.trim()) {
    errors.dateOfBirth = 'La fecha de nacimiento es obligatoria.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
    // Validar formato YYYY-MM-DD básico
    errors.dateOfBirth = 'Formato de fecha de nacimiento inválido (YYYY-MM-DD).';
  }

  // El historial médico es opcional, así que no se valida su presencia
  // Podríamos añadir validación de longitud si fuera necesario.

  return errors;
};
