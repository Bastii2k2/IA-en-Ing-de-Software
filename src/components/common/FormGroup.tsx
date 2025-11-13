// src/components/common/FormGroup.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @interface FormGroupProps
 * @description Propiedades para el componente FormGroup.
 * @property {string} label - La etiqueta visible para el campo del formulario.
 * @property {string} [error] - El mensaje de error a mostrar, si existe.
 * @property {React.ReactNode} children - El componente del formulario (ej. StyledInput, DatePickerInput).
 */
interface FormGroupProps {
  label: string;
  error?: string;
  children: React.ReactNode;
}

/**
 * @function FormGroup
 * @description Un componente contenedor que agrupa una etiqueta,
 * un campo de formulario y un mensaje de error.
 * Facilita la construcción de formularios consistentes.
 * @param {FormGroupProps} props - Las propiedades para el FormGroup.
 * @returns {JSX.Element} Un componente que encapsula un campo de formulario.
 */
const FormGroup: React.FC<FormGroupProps> = ({ label, error, children }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      {children}
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15, // Espacio entre grupos de formulario
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  errorText: {
    color: '#dc3545', // Color rojo para errores
    fontSize: 14,
    marginTop: -5, // Para que esté más cerca del input
    marginBottom: 5,
  },
});

export default FormGroup;
