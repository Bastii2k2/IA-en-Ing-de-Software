// src/screens/MedicationNotificationScreen.tsx

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useNotificationListener } from '../hooks/useNotificationListener';
import { notificationService } from '../services/NotificationService';
import { INCOMPATIBLE_MEDS } from '../utils/constants';

/**
 * Pantalla de demostración para las alertas y notificaciones de medicación.
 * Permite simular la detección de interacciones y la programación de dosis.
 */
const MedicationNotificationScreen: React.FC = () => {
  // Utiliza el hook para escuchar y mostrar notificaciones.
  useNotificationListener();

  const [currentMedications, setCurrentMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState<string>('');
  const [doseMedicationName, setDoseMedicationName] = useState<string>('');

  /**
   * Añade un nuevo medicamento a la lista actual del paciente.
   */
  const addMedication = () => {
    if (newMedication.trim()) {
      setCurrentMedications([...currentMedications, newMedication.trim()]);
      setNewMedication('');
    } else {
      Alert.alert('Error', 'Por favor, ingresa un nombre de medicamento válido.');
    }
  };

  /**
   * Elimina un medicamento de la lista actual.
   * @param medToDelete El nombre del medicamento a eliminar.
   */
  const removeMedication = (medToDelete: string) => {
    setCurrentMedications(currentMedications.filter(med => med !== medToDelete));
  };

  /**
   * Dispara la simulación de verificación de interacciones llamando al servicio.
   */
  const handleCheckInteractions = () => {
    if (currentMedications.length < 1) {
      Alert.alert('Información', 'Por favor, añade al menos un medicamento para verificar interacciones.');
      return;
    }
    notificationService.checkMedicationInteractions(currentMedications);
  };

  /**
   * Dispara la simulación de notificación de dosis llamando al servicio.
   */
  const handleScheduleDose = () => {
    if (doseMedicationName.trim()) {
      // Simula una notificación en 5 segundos.
      notificationService.scheduleDoseNotification(doseMedicationName.trim(), 5000);
      Alert.alert('Programado', `Notificación de dosis para "${doseMedicationName.trim()}" programada en 5 segundos.`);
      setDoseMedicationName('');
    } else {
      Alert.alert('Error', 'Por favor, ingresa el nombre del medicamento para la dosis.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Alertas y Notificaciones de Medicación</Text>

      {/* Sección para simular interacciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simular Interacciones de Medicamentos</Text>
        <Text style={styles.instructionText}>
          Añade medicamentos. Prueba a añadir "{INCOMPATIBLE_MEDS[0]}" y "{INCOMPATIBLE_MEDS[1]}" para ver una interacción.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del medicamento"
          value={newMedication}
          onChangeText={setNewMedication}
        />
        <Button title="Añadir Medicamento" onPress={addMedication} />

        <View style={styles.medicationsList}>
          <Text style={styles.listTitle}>Tus medicamentos actuales:</Text>
          {currentMedications.length === 0 ? (
            <Text style={styles.noMedsText}>No hay medicamentos añadidos.</Text>
          ) : (
            currentMedications.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <Text style={styles.medicationText}>{med}</Text>
                <Button title="X" onPress={() => removeMedication(med)} color="red" />
              </View>
            ))
          )}
        </View>
        <View style={styles.buttonSpacer} />
        <Button title="Verificar Interacciones Ahora" onPress={handleCheckInteractions} />
      </View>

      {/* Sección para simular notificación de dosis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simular Notificación de Dosis</Text>
        <Text style={styles.instructionText}>
          Programa una notificación que aparecerá en 5 segundos.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Medicamento para la dosis (ej: Paracetamol)"
          value={doseMedicationName}
          onChangeText={setDoseMedicationName}
        />
        <Button title="Programar Notificación de Dosis" onPress={handleScheduleDose} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonSpacer: {
    height: 15, // Espacio entre botones
  },
  medicationsList: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#444',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  medicationText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  noMedsText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MedicationNotificationScreen;
