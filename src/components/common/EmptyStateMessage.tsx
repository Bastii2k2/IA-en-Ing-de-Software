// src/components/common/EmptyStateMessage.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @interface EmptyStateMessageProps
 * Propiedades para el componente EmptyStateMessage.
 */
interface EmptyStateMessageProps {
  message: string; // El mensaje a mostrar
}

/**
 * @function EmptyStateMessage
 * Un componente genérico para mostrar un mensaje cuando un estado está vacío
 * o no hay resultados.
 *
 * @param {EmptyStateMessageProps} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente View con un texto centrado.
 */
const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default EmptyStateMessage;
