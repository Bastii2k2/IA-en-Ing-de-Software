import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asume que se usa react-native-vector-icons

/**
 * src/components/MissedDoseAlert.tsx
 * Componente presentacional que muestra una alerta si el paciente ha omitido dosis.
 * Implementa el escenario Gherkin de "alerta de incumplimiento".
 */

interface MissedDoseAlertProps {
  missedDoses: number; // Número de dosis omitidas
}

const MissedDoseAlert: React.FC<MissedDoseAlertProps> = ({ missedDoses }) => {
  if (missedDoses <= 0) {
    return null; // No mostrar nada si no hay dosis omitidas
  }

  return (
    <View style={styles.alertContainer}>
      <Icon name="warning" size={30} color="#FFD700" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.alertTitle}>Alerta de Incumplimiento</Text>
        <Text style={styles.alertMessage}>
          El paciente ha omitido {missedDoses} dosis. Se recomienda revisar la adherencia y ajustar el plan de tratamiento si es necesario.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFBE0', // Fondo amarillo claro para la alerta
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700', // Borde amarillo
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CC8400', // Naranja oscuro para el título
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: '#664200', // Marrón oscuro para el mensaje
  },
});

export default MissedDoseAlert;
