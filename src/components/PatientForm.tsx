// src/components/PatientForm.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PatientFormData } from '../types/patient';
import { usePatientForm } from '../hooks/usePatientForm';
import { StyledInput } from './StyledInput';
import { Button } from './Button';

interface PatientFormProps {
  initialValues: PatientFormData; // Valores iniciales para editar
  onSubmit: (data: PatientFormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting?: boolean; // Propiedad para indicar si la pantalla ya está en estado de envío
}

/**
 * Componente de formulario genérico para registro y edición de pacientes.
 * Reutiliza el hook `usePatientForm` para la lógica y `StyledInput` para los campos.
 */
export const PatientForm: React.FC<PatientFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText,
  isSubmitting: isSubmittingFromParent = false, // Permite que la pantalla controle el estado de envío
}) => {
  // Utilizamos el hook personalizado para manejar el estado del formulario y la validación
  const { values, errors, handleChange, handleSubmit, isSubmitting: isSubmittingFromHook } = usePatientForm({
    initialValues,
    onSubmit,
  });

  // El botón estará deshabilitado si el formulario está siendo enviado (desde el hook o desde el padre)
  const isDisabled = isSubmittingFromParent || isSubmittingFromHook;

  return (
    <View style={styles.container}>
      <StyledInput
        label="Nombre Completo"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Ej: Juan Pérez"
        error={errors.name}
      />
      <StyledInput
        label="Fecha de Nacimiento (YYYY-MM-DD)"
        value={values.dob}
        onChangeText={(text) => handleChange('dob', text)}
        placeholder="Ej: 1990-01-15"
        keyboardType="numeric"
        error={errors.dob}
      />
      <StyledInput
        label="Historial Médico"
        value={values.medicalHistory}
        onChangeText={(text) => handleChange('medicalHistory', text)}
        placeholder="Alergias, condiciones preexistentes..."
        multiline
        numberOfLines={4}
        error={errors.medicalHistory}
      />

      <Button
        title={submitButtonText}
        onPress={handleSubmit}
        disabled={isDisabled}
        loading={isDisabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
