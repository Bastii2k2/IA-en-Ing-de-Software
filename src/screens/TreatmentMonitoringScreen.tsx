import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack'; // Para props de navegación
import { useTreatmentMonitoring } from '../hooks/useTreatmentMonitoring';
import ComplianceIndicator from '../components/ComplianceIndicator';
import MissedDoseAlert from '../components/MissedDoseAlert';

/**
 * src/screens/TreatmentMonitoringScreen.tsx
 * Pantalla principal para el seguimiento del tratamiento de un paciente.
 * Muestra el estado del tratamiento, incluyendo el cumplimiento y las dosis omitidas.
 * Esta pantalla asume el uso de React Navigation.
 *
 * Para propósitos de simulación, el 'patientId' se podría pasar vía params de navegación,
 * o se usa un valor fijo para demostración.
 */

// Define los tipos de parámetros para tu Stack Navigator.
// Aquí, asumimos un PatientStack para simplificar.
type RootStackParamList = {
  TreatmentMonitoring: { patientId: string };
  // Otras pantallas...
};

type TreatmentMonitoringScreenProps = StackScreenProps<RootStackParamList, 'TreatmentMonitoring'>;

const TreatmentMonitoringScreen: React.FC<TreatmentMonitoringScreenProps> = ({ route }) => {
  // En una aplicación real, el patientId vendría de los parámetros de navegación.
  // const { patientId } = route.params;
  // Para la simulación, usaremos un ID fijo o lo podemos alternar para probar ambos escenarios.
  const patientId = 'patient123'; // Cambiar a 'patient456' o 'patient123' para probar escenarios

  const { treatmentStatus, isLoading, error } = useTreatmentMonitoring(patientId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando estado del tratamiento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!treatmentStatus) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No se encontró información del tratamiento para este paciente.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Seguimiento del Tratamiento</Text>
      <Text style={styles.patientIdText}>Paciente ID: {patientId}</Text>

      {/* Componente para mostrar el indicador de cumplimiento */}
      <ComplianceIndicator complianceRate={treatmentStatus.complianceRate} />

      {/* Componente para mostrar la alerta de dosis omitidas */}
      <MissedDoseAlert missedDoses={treatmentStatus.missedDoses} />

      {/* Información adicional del tratamiento si se desea */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Detalles Adicionales</Text>
        <Text style={styles.infoText}>Próxima revisión: 15/11/2025</Text>
        <Text style={styles.infoText}>Medicamento principal: Ibuprofeno 600mg</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  patientIdText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default TreatmentMonitoringScreen;
