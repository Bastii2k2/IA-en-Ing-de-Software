// src/components/patients/PatientListItem.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Patient } from '../../types';

/**
 * @interface PatientListItemProps
 * Propiedades para el componente PatientListItem.
 */
interface PatientListItemProps {
  patient: Patient; // El objeto paciente a mostrar
  onPress?: (patient: Patient) => void; // Función opcional para manejar el click en el item
}

/**
 * @function PatientListItem
 * Un componente que muestra la información básica de un paciente en una lista.
 * Es interactivo (TouchableOpacity) para futuras expansiones (ej. ver detalles).
 *
 * @param {PatientListItemProps} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente visual para un paciente individual.
 */
const PatientListItem: React.FC<PatientListItemProps> = ({ patient, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(patient)} // Ejecuta onPress si está definido
      activeOpacity={onPress ? 0.7 : 1} // Solo activa la opacidad si hay un manejador de clic
    >
      <Text style={styles.name}>{patient.name} {patient.surname}</Text>
      <Text style={styles.detail}>Fecha Nac.: {patient.dob}</Text>
      <Text style={styles.detail}>Historial: {patient.medicalHistory.substring(0, 50)}{patient.medicalHistory.length > 50 ? '...' : ''}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default PatientListItem;
