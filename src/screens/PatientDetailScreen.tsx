// src/screens/PatientDetailScreen.tsx
/**
 * @file Pantalla de detalles de un paciente.
 * Contiene un botón para abrir el modal de importación de imágenes.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StyledButton from '../components/StyledButton';
import ImageImportModal from '../components/ImageImportModal';
import PatientService from '../services/PatientService'; // Para obtener el patientId

const PatientDetailScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const patientId = PatientService.getCurrentPatientId(); // Obtenemos un ID de paciente simulado

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Paciente</Text>
      <Text style={styles.patientIdText}>ID del Paciente: {patientId}</Text>
      <Text style={styles.infoText}>Aquí iría información detallada del paciente.</Text>

      {/* Botón para abrir el modal de importación de imágenes */}
      <StyledButton
        title="Importar Imágenes Médicas"
        onPress={() => setIsModalVisible(true)}
        style={styles.openModalButton}
      />

      {/* El modal de importación de imágenes */}
      <ImageImportModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        patientId={patientId} // Pasamos el ID del paciente al modal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  patientIdText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  openModalButton: {
    backgroundColor: '#17a2b8', // Un color cian para el botón de abrir modal
    marginTop: 20,
  },
});

export default PatientDetailScreen;
