// src/components/MedicationItemForm.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StyledInput from './common/StyledInput';
import Button from './common/Button';
import DropdownPicker from './common/DropdownPicker';
import { Medication, MedicationPrescription } from '../types';

/**
 * @interface MedicationItemFormProps
 * @description Props para el componente MedicationItemForm.
 */
interface MedicationItemFormProps {
  medicationPrescription: MedicationPrescription;
  allMedications: Medication[];
  onUpdate: (uiId: string, field: keyof MedicationPrescription, value: string) => void;
  onRemove: (uiId: string) => void;
  error?: { dosage?: string; instructions?: string; medicationId?: string }; // Para mostrar errores de validación
}

/**
 * @function MedicationItemForm
 * @description Componente para introducir y editar los detalles de un medicamento prescrito.
 * @param {MedicationItemFormProps} props - Propiedades para el formulario de medicamento.
 * @returns {JSX.Element} Un componente de formulario para un solo medicamento.
 */
const MedicationItemForm: React.FC<MedicationItemFormProps> = ({
  medicationPrescription,
  allMedications,
  onUpdate,
  onRemove,
  error,
}) => {
  const { uiId, medicationId, dosage, instructions } = medicationPrescription;

  const handleMedicationChange = (value: string) => {
    const selectedMed = allMedications.find(m => m.id === value);
    onUpdate(uiId, 'medicationId', value);
    onUpdate(uiId, 'medicationName', selectedMed ? selectedMed.name : '');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{medicationPrescription.medicationName || 'Nuevo Medicamento'}</Text>
        <Button
          title="Eliminar"
          onPress={() => onRemove(uiId)}
          variant="danger"
          style={styles.removeButton}
          textStyle={styles.removeButtonText}
        />
      </View>

      <DropdownPicker
        label="Medicamento"
        selectedValue={medicationId}
        onValueChange={handleMedicationChange}
        items={allMedications}
        placeholder="Seleccione un medicamento"
      />
      {error?.medicationId && <Text style={styles.errorText}>{error.medicationId}</Text>}

      <StyledInput
        label="Dosis"
        placeholder="Ej: 500mg cada 8 horas"
        value={dosage}
        onChangeText={(text) => onUpdate(uiId, 'dosage', text)}
      />
      {error?.dosage && <Text style={styles.errorText}>{error.dosage}</Text>}

      <StyledInput
        label="Instrucciones"
        placeholder="Ej: Tomar con alimentos"
        value={instructions}
        onChangeText={(text) => onUpdate(uiId, 'instructions', text)}
        multiline
        numberOfLines={3}
        style={styles.instructionsInput}
      />
      {error?.instructions && <Text style={styles.errorText}>{error.instructions}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Permite que el texto se encoja si el botón es grande
    marginRight: 10,
  },
  removeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  removeButtonText: {
    fontSize: 14,
  },
  instructionsInput: {
    height: 80, // Mayor altura para instrucciones multilínea
    textAlignVertical: 'top', // Alinea el texto al inicio en Android
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    marginTop: -5,
  },
});

export default MedicationItemForm;
