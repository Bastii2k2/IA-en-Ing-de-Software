// src/components/common/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, TouchableOpacityProps, ActivityIndicator } from 'react-native';

/**
 * @interface ButtonProps
 * @description Props para el componente Button.
 * @augments TouchableOpacityProps Incluye todas las props estándar de TouchableOpacity.
 */
interface ButtonProps extends TouchableOpacityProps {
  title: string;
  loading?: boolean; // Para mostrar un spinner si está cargando
  variant?: 'primary' | 'secondary' | 'danger'; // Opcional: para diferentes estilos
}

/**
 * @function Button
 * @description Componente de botón estilizado.
 * @param {ButtonProps} props - Propiedades para el botón.
 * @returns {JSX.Element} Un componente Button con estilos predefinidos.
 */
const Button: React.FC<ButtonProps> = ({ title, onPress, loading = false, variant = 'primary', style, textStyle, ...rest }) => {
  const buttonStyles = [styles.button, styles[variant], style];
  const titleStyles = [styles.buttonText, styles[`${variant}Text`], textStyle];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={loading || rest.disabled} // Deshabilita el botón si está cargando o explícitamente deshabilitado
      {...rest}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={titleStyles}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45, // Altura mínima para asegurar que el spinner se vea bien
  },
  primary: {
    backgroundColor: '#007bff',
  },
  secondary: {
    backgroundColor: '#6c757d',
  },
  danger: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  primaryText: {}, // Puedes añadir estilos específicos si es necesario
  secondaryText: {},
  dangerText: {},
});

export default Button;
