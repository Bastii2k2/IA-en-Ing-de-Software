// src/hooks/usePrescriptionFormLogic.ts

import { useState, useCallback } from 'react';
import { Patient, Medication, MedicationPrescription, PrescriptionData } from '../types';
import uuid from 'react-native-uuid'; // Para generar IDs únicos para los medicamentos en la UI

/**
 * @interface FormErrors
 * @description Define la estructura de errores de validación para el formulario.
 */
interface FormErrors {
  patientId?: string;
  medications?: { [uiId: string]: { medicationId?: string; dosage?: string; instructions?: string } };
  general?: string;
}

/**
 * @function usePrescriptionFormLogic
 * @description Hook personalizado para manejar la lógica de estado y validación
 *              del formulario de generación de recetas.
 * @returns {object} Un objeto con el estado del formulario, las acciones y los errores.
 */
const usePrescriptionFormLogic = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [medications, setMedications] = useState<MedicationPrescription[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * @function addMedication
   * @description Añade un nuevo medicamento vacío a la lista de prescripciones.
   */
  const addMedication = useCallback(() => {
    const newMedication: MedicationPrescription = {
      uiId: uuid.v4().toString(), // Genera un ID único para la UI
      medicationId: '',
      medicationName: '',
      dosage: '',
      instructions: '',
    };
    setMedications((prev) => [...prev, newMedication]);
  }, []);

  /**
   * @function updateMedication
   * @description Actualiza un campo específico de un medicamento en la lista.
   * @param {string} uiId - El ID único del medicamento a actualizar.
   * @param {keyof MedicationPrescription} field - El campo del medicamento a actualizar.
   * @param {string} value - El nuevo valor del campo.
   */
  const updateMedication = useCallback((uiId: string, field: keyof MedicationPrescription, value: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.uiId === uiId ? { ...med, [field]: value } : med))
    );
    // Limpia el error para este campo si existe
    if (errors.medications?.[uiId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        medications: {
          ...prev.medications,
          [uiId]: {
            ...prev.medications?.[uiId],
            [field]: undefined,
          }
        }
      }));
    }
  }, [errors.medications]);

  /**
   * @function removeMedication
   * @description Elimina un medicamento de la lista de prescripciones.
   * @param {string} uiId - El ID único del medicamento a eliminar.
   */
  const removeMedication = useCallback((uiId: string) => {
    setMedications((prev) => prev.filter((med) => med.uiId !== uiId));
    // También elimina errores asociados si existen
    if (errors.medications?.[uiId]) {
        setErrors(prev => {
            const newMedsErrors = { ...prev.medications };
            delete newMedsErrors[uiId];
            return { ...prev, medications: newMedsErrors };
        });
    }
  }, [errors.medications]);

  /**
   * @function validateForm
   * @description Valida todos los campos del formulario de receta.
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!selectedPatientId) {
      newErrors.patientId = 'Debe seleccionar un paciente.';
      isValid = false;
    }

    if (medications.length === 0) {
      newErrors.general = 'Debe añadir al menos un medicamento.';
      isValid = false;
    } else {
      newErrors.medications = {};
      medications.forEach(med => {
        let medIsValid = true;
        const medErrors: { medicationId?: string; dosage?: string; instructions?: string } = {};

        if (!med.medicationId) {
          medErrors.medicationId = 'Seleccione un medicamento.';
          medIsValid = false;
        }
        if (!med.dosage.trim()) {
          medErrors.dosage = 'La dosis es obligatoria.';
          medIsValid = false;
        }
        if (!med.instructions.trim()) {
          medErrors.instructions = 'Las instrucciones son obligatorias.';
          medIsValid = false;
        }

        if (!medIsValid) {
          newErrors.medications![med.uiId] = medErrors;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  }, [selectedPatientId, medications]);

  /**
   * @function getPrescriptionData
   * @description Prepara los datos del formulario para ser enviados al servicio.
   * @returns {PrescriptionData} Los datos de la receta listos para el servicio.
   */
  const getPrescriptionData = useCallback((): PrescriptionData => {
    return {
      patientId: selectedPatientId,
      medications: medications.map(med => ({
        medicationId: med.medicationId,
        dosage: med.dosage,
        instructions: med.instructions,
      })),
    };
  }, [selectedPatientId, medications]);

  /**
   * @function resetForm
   * @description Reinicia el estado del formulario a sus valores iniciales.
   */
  const resetForm = useCallback(() => {
    setSelectedPatientId('');
    setMedications([]);
    setErrors({});
  }, []);

  return {
    // Estado
    selectedPatientId,
    medications,
    errors,
    // Acciones
    setSelectedPatientId,
    addMedication,
    updateMedication,
    removeMedication,
    validateForm,
    getPrescriptionData,
    resetForm,
  };
};

export default usePrescriptionFormLogic;
