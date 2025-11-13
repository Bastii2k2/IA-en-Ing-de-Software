// src/components/SuccessMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SuccessMessageProps {
  message: string;
}

/**
 * Componente para mostrar mensajes de éxito al usuario.
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  if (!message) return null; // No muestra nada si no hay mensaje

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    marginVertical: 10,
    alignItems: 'center',
  },
  message: {
    color: '#155724',
    fontSize: 16,
    textAlign: 'center',
  },
});
