import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress'; // Asume que se usa una librería de progreso

/**
 * src/components/ComplianceIndicator.tsx
 * Componente presentacional que muestra el índice de cumplimiento del tratamiento.
 * Implementa el escenario Gherkin de "cumplimiento alto".
 * Usará react-native-progress para una visualización simple.
 */

interface ComplianceIndicatorProps {
  complianceRate: number; // Tasa de cumplimiento entre 0.0 y 1.0
}

const ComplianceIndicator: React.FC<ComplianceIndicatorProps> = ({ complianceRate }) => {
  const percentage = Math.round(complianceRate * 100);
  const color = complianceRate >= 0.8 ? '#4CAF50' : complianceRate >= 0.5 ? '#FFC107' : '#F44336'; // Verde, Amarillo, Rojo

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cumplimiento del Tratamiento</Text>
      <Progress.Bar
        progress={complianceRate}
        width={null} // Ocupa el ancho disponible
        height={20}
        color={color}
        unfilledColor="#e0e0e0"
        borderColor="#ccc"
        borderRadius={10}
        style={styles.progressBar}
      />
      <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
      {complianceRate >= 0.8 && (
        <Text style={styles.statusText}>¡Excelente adherencia al tratamiento!</Text>
      )}
      {complianceRate < 0.8 && complianceRate >= 0.5 && (
        <Text style={styles.statusText}>Adherencia moderada, revisar.</Text>
      )}
      {complianceRate < 0.5 && (
        <Text style={styles.statusText}>Baja adherencia, requiere atención urgente.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  progressBar: {
    width: '100%',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ComplianceIndicator;
