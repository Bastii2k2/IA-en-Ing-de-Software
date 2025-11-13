// src/components/ui/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';

/**
 * @interface ButtonProps
 * @description Propiedades para el componente Button.
 * @property {string} title - El texto que se mostrará en el botón.
 * @property {boolean} [isLoading] - Si es `true`, muestra un indicador de carga y deshabilita el botón.
 * @property {boolean} [disabled] - Si es `true`, deshabilita el botón (además de isLoading).
 * Extiende TouchableOpacityProps para manejar eventos como onPress.
 */
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  isLoading?: boolean;
  disabled?: boolean;
}

/**
 * @function Button
 * @description Un componente de botón estilizado y reutilizable.
 * Muestra un indicador de carga cuando isLoading es true.
 * @param {ButtonProps} props - Las propiedades para el botón.
 * @returns {JSX.Element} Un componente Button.
 */
const Button: React.FC<ButtonProps> = ({ title, onPress, isLoading = false, disabled = false, style, ...rest }) => {
  const isDisabled = isLoading || disabled;

  return (
    <TouchableOpacity
      style={[styles.button, isDisabled && styles.buttonDisabled, style]}
      onPress={onPress}
      disabled={isDisabled}
      {...rest}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={styles.buttonText}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff', // Color primario
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45, // Altura mínima para el botón
  },
  buttonDisabled: {
    backgroundColor: '#a0c7ff', // Color más claro cuando está deshabilitado
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Button;
