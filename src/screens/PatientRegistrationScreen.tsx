// src/screens/PatientRegistrationScreen.tsx

import React from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { usePatientForm } from '../hooks/usePatientForm';
import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/ui/StyledInput';
import Button from '../components/ui/Button';
import DatePickerInput from '../components/ui/DatePickerInput';

// Definimos los tipos para la navegación
type RootStackParamList = {
  PatientRegistration: undefined;
  // Puedes añadir otras pantallas aquí si es necesario
};
type PatientRegistrationScreenProps = StackScreenProps<RootStackParamList, 'PatientRegistration'>;

/**
 * @function PatientRegistrationScreen
 * @description Pantalla para el registro de nuevos pacientes.
 * Utiliza el hook `usePatientForm` para gestionar el estado del formulario,
 * la validación y el envío.
 */
const PatientRegistrationScreen: React.FC<PatientRegistrationScreenProps> = () => {
  // Callback para cuando el formulario se envía con éxito.
  // En una app real, podrías navegar a otra pantalla, actualizar una lista, etc.
  const handleRegistrationSuccess = () => {
    console.log('Navegar o actualizar UI después del registro exitoso.');
    // Por ejemplo: navigation.goBack(); o Alert.alert('Éxito', 'Paciente registrado!');
  };

  // Inicializamos el hook usePatientForm
  const { formData, errors, isLoading, handleChange, handleSubmit } =
    usePatientForm(handleRegistrationSuccess);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Registrar Nuevo Paciente</Text>

      {/* Campo para el nombre del paciente */}
      <FormGroup label="Nombre Completo" error={errors.name}>
        <StyledInput
          placeholder="Ej: Juan Pérez"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          autoCapitalize="words" // Capitaliza la primera letra de cada palabra
        />
      </FormGroup>

      {/* Campo para la fecha de nacimiento */}
      <FormGroup label="Fecha de Nacimiento (YYYY-MM-DD)" error={errors.dateOfBirth}>
        <DatePickerInput
          placeholder="Ej: 1990-01-15"
          value={formData.dateOfBirth}
          onValueChange={(date) => handleChange('dateOfBirth', date)}
        />
      </FormGroup>

      {/* Campo para el historial médico (TextArea) */}
      <FormGroup label="Historial Médico">
        <StyledInput
          placeholder="Ej: Alergia a la penicilina, asma infantil..."
          value={formData.medicalHistory}
          onChangeText={(text) => handleChange('medicalHistory', text)}
          multiline // Permite múltiples líneas de texto
          numberOfLines={4} // Altura inicial para 4 líneas
          style={styles.textArea} // Estilo específico para el área de texto
        />
      </FormGroup>

      {/* Botón para enviar el formulario */}
      <Button
        title="Registrar Paciente"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 30,
    textAlign: 'center',
  },
  textArea: {
    height: 100, // Altura fija para el historial médico
    textAlignVertical: 'top', // Para que el texto empiece arriba
  },
  button: {
    marginTop: 20,
  },
});

export default PatientRegistrationScreen;
