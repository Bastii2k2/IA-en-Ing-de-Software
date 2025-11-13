// src/components/common/StyledInput.tsx

import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

/**
 * @interface StyledInputProps
 * @description Props para el componente StyledInput.
 * @augments TextInputProps Incluye todas las props estándar de TextInput.
 */
interface StyledInputProps extends TextInputProps {
  // Puedes añadir props personalizadas si es necesario
}

/**
 * @function StyledInput
 * @description Componente de entrada de texto estilizado.
 * @param {StyledInputProps} props - Propiedades para el TextInput.
 * @returns {JSX.Element} Un componente TextInput con estilos predefinidos.
 */
const StyledInput: React.FC<StyledInputProps> = (props) => {
  return (
    <TextInput
      style={styles.input}
      placeholderTextColor="#888"
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#fff',
    color: '#333',
  },
});

export default StyledInput;
