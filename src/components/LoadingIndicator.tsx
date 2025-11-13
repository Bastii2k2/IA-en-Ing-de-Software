// src/components/LoadingIndicator.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

/**
 * Componente para mostrar un indicador de carga.
 * Útil para operaciones asíncronas, como la carga de datos.
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Cargando...',
  size = 'large',
  color = '#007bff',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
