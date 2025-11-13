// src/hooks/usePatientForm.ts
import { useState, useCallback } from 'react';
import { PatientFormData } from '../types/patient';

interface UsePatientFormProps {
  initialValues: PatientFormData;
  onSubmit: (data: PatientFormData) => Promise<void>;
}

interface UsePatientFormResult {
  values: PatientFormData;
  errors: { [key: string]: string };
  handleChange: (field: keyof PatientFormData, value: string) => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  resetForm: () => void;
}

/**
 * Hook personalizado para gestionar la lógica de un formulario de paciente.
 * Maneja el estado de los valores del formulario, errores de validación y el estado de envío.
 * Puede ser utilizado tanto para crear como para editar pacientes, gracias a `initialValues`.
 */
export const usePatientForm = ({ initialValues, onSubmit }: UsePatientFormProps): UsePatientFormResult => {
  const [values, setValues] = useState<PatientFormData>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para manejar el cambio de valores en los campos del formulario
  const handleChange = useCallback((field: keyof PatientFormData, value: string) => {
    setValues(prevValues => ({ ...prevValues, [field]: value }));
    // Limpiar el error para el campo modificado si existe
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Función para validar los datos del formulario
  const validate = (data: PatientFormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!data.dob.trim()) newErrors.dob = 'La fecha de nacimiento es obligatoria.';
    // Simple validación de formato de fecha YYYY-MM-DD
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dob)) newErrors.dob = 'Formato de fecha inválido (YYYY-MM-DD).';
    if (!data.medicalHistory.trim()) newErrors.medicalHistory = 'El historial médico es obligatorio.';
    return newErrors;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(async () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (e) {
        console.error('Error submitting form:', e);
        // Podríamos manejar errores específicos aquí o dejar que la pantalla los maneje
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, onSubmit]);

  // Función para resetear el formulario a sus valores iniciales
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    resetForm,
  };
};
