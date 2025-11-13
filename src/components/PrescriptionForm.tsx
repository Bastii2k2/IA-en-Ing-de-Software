// src/components/PrescriptionForm.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './common/Button';
import DropdownPicker from './common/DropdownPicker';
import MedicationItemForm from './MedicationItemForm';
import { Patient, Medication, MedicationPrescription } from '../types';
import { FormErrors } from '../hooks/usePrescriptionFormLogic'; // Importa FormErrors

/**
 * @interface PrescriptionFormProps
 * @description Props para el componente PrescriptionForm.
 */
interface PrescriptionFormProps {
  patients: Patient[];
  allMedications: Medication[];
  selectedPatientId: string;
  medications: MedicationPrescription[];
  errors: FormErrors;
  onPatientChange: (patientId: string) => void;
  onAddMedication: () => void;
  onUpdateMedication: (uiId: string, field: keyof MedicationPrescription, value: string) => void;
  onRemoveMedication: (uiId: string) => void;
  // Puedes añadir onSubmit, loading, etc. si el botón de submit está aquí
}

/**
 * @function PrescriptionForm
 * @description Componente de formulario para la generación de recetas.
 *              Encapsula la selección de paciente y la lista de medicamentos.
 * @param {PrescriptionFormProps} props - Propiedades para el formulario de receta.
 * @returns {JSX.Element} Un componente de formulario de receta.
 */
const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  patients,
  allMedications,
  selectedPatientId,
  medications,
  errors,
  onPatientChange,
  onAddMedication,
  onUpdateMedication,
  onRemoveMedication,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Datos del Paciente</Text>
      <DropdownPicker
        label="Seleccionar Paciente"
        selectedValue={selectedPatientId}
        onValueChange={onPatientChange}
        items={patients}
        placeholder="Seleccione un paciente"
      />
      {errors.patientId && <Text style={styles.errorText}>{errors.patientId}</Text>}

      <Text style={styles.sectionTitle}>Medicamentos</Text>
      {medications.map((med) => (
        <MedicationItemForm
          key={med.uiId}
          medicationPrescription={med}
          allMedications={allMedications}
          onUpdate={onUpdateMedication}
          onRemove={onRemoveMedication}
          error={errors.medications?.[med.uiId]}
        />
      ))}

      <Button title="Añadir Medicamento" onPress={onAddMedication} style={styles.addButton} />
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  contentContainer: {
    paddingBottom: 20, // Asegura espacio al final del scroll
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  addButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#28a745',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default PrescriptionForm;
