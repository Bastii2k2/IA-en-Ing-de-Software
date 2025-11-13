// src/types/patient.ts
/**
 * @interface Patient
 * Define la estructura de un objeto paciente en la aplicación.
 */
export interface Patient {
  id: string;
  name: string;
  dob: string; // Date of Birth en formato YYYY-MM-DD
  medicalHistory: string;
  // Otros campos que puedan ser necesarios
}

/**
 * @interface PatientFormData
 * Define la estructura de los datos que maneja el formulario de paciente.
 * Es similar a 'Patient' pero sin 'id', ya que el ID se gestiona fuera del formulario.
 */
export interface PatientFormData {
  name: string;
  dob: string;
  medicalHistory: string;
}
