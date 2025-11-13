/**
 * src/types/treatment.ts
 * Define las interfaces de TypeScript para los datos relacionados con el tratamiento.
 */

/**
 * Interfaz que define la estructura de datos para el estado del tratamiento de un paciente.
 * @property {number} complianceRate - Tasa de cumplimiento del tratamiento (entre 0.0 y 1.0).
 * @property {number} missedDoses - Número de dosis omitidas por el paciente.
 */
export interface TreatmentStatus {
  complianceRate: number;
  missedDoses: number;
}
