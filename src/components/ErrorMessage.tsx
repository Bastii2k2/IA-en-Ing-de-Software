// src/components/ErrorMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

/**
 * Componente para mostrar mensajes de error al usuario.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null; // No muestra nada si no hay mensaje

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
    marginVertical: 10,
    alignItems: 'center',
  },
  message: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
});
