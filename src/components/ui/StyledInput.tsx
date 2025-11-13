// src/components/ui/StyledInput.tsx

import React from 'react';
import { TextInput, StyleSheet, TextInputProps } from 'react-native';

/**
 * @interface StyledInputProps
 * @description Propiedades para el componente StyledInput.
 * Extiende las props nativas de TextInput.
 */
interface StyledInputProps extends TextInputProps {
  // Aquí se podrían añadir props específicas si fueran necesarias,
  // por ejemplo, para cambiar el color del borde en caso de error.
}

/**
 * @function StyledInput
 * @description Un componente de entrada de texto estilizado y reutilizable.
 * @param {StyledInputProps} props - Las propiedades para el TextInput.
 * @returns {JSX.Element} Un componente TextInput con estilos predefinidos.
 */
const StyledInput: React.FC<StyledInputProps> = (props) => {
  return (
    <TextInput
      style={[styles.input, props.style]} // Permite sobrescribir estilos externos
      placeholderTextColor="#888" // Color para el texto del placeholder
      {...props} // Pasa todas las demás props al TextInput nativo
    />
  );
};

const styles = StyleSheet.create({
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    marginBottom: 10, // Espacio entre inputs
    fontSize: 16,
    color: '#333',
  },
});

export default StyledInput;
