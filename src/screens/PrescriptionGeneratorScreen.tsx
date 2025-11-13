// src/screens/PrescriptionGeneratorScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import PrescriptionForm from '../components/PrescriptionForm';
import Button from '../components/common/Button';
import { patientService } from '../services/PatientService';
import { medicationService } from '../services/MedicationService';
import { prescriptionService } from '../services/PrescriptionService';
import { Patient, Medication } from '../types';
import usePrescriptionFormLogic from '../hooks/usePrescriptionFormLogic';
import { StackScreenProps } from '@react-navigation/stack'; // Si usas Stack Navigator

// Define los tipos de parámetros para la navegación (ejemplo)
type RootStackParamList = {
  PrescriptionGenerator: undefined;
  // Puedes añadir otras pantallas aquí
};

// Define las props para esta pantalla
type PrescriptionGeneratorScreenProps = StackScreenProps<RootStackParamList, 'PrescriptionGenerator'>;

/**
 * @function PrescriptionGeneratorScreen
 * @description Pantalla principal para generar recetas electrónicas.
 *              Orquesta la carga de datos, la gestión del formulario y la interacción con los servicios.
 * @param {PrescriptionGeneratorScreenProps} props - Propiedades de navegación.
 * @returns {JSX.Element} La pantalla de generación de recetas.
 */
const PrescriptionGeneratorScreen: React.FC<PrescriptionGeneratorScreenProps> = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allMedications, setAllMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Hook personalizado para la lógica del formulario
  const {
    selectedPatientId,
    medications,
    errors,
    setSelectedPatientId,
    addMedication,
    updateMedication,
    removeMedication,
    validateForm,
    getPrescriptionData,
    resetForm,
  } = usePrescriptionFormLogic();

  // Cargar datos iniciales (pacientes y medicamentos) al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [patientsData, medicationsData] = await Promise.all([
          patientService.getPatients(),
          medicationService.getMedications(),
        ]);
        setPatients(patientsData);
        setAllMedications(medicationsData);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos de pacientes o medicamentos.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario para generar la receta.
   *              Realiza la validación y llama al servicio de recetas.
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error de validación', 'Por favor, corrija los errores en el formulario.');
      return;
    }

    setSubmitting(true);
    try {
      const prescriptionData = getPrescriptionData();
      await prescriptionService.generatePrescription(prescriptionData);
      resetForm(); // Limpiar el formulario después de una generación exitosa
    } catch (error: any) {
      // El PrescriptionService ya muestra alertas de errores específicos (Gherkin)
      // Aquí puedes manejar errores genéricos o loguearlos
      console.error('Error al generar la receta:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <PrescriptionForm
        patients={patients}
        allMedications={allMedications}
        selectedPatientId={selectedPatientId}
        medications={medications}
        errors={errors}
        onPatientChange={setSelectedPatientId}
        onAddMedication={addMedication}
        onUpdateMedication={updateMedication}
        onRemoveMedication={removeMedication}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Generar Receta"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
});

export default PrescriptionGeneratorScreen;
