// src/components/common/StyledButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

/**
 * @interface StyledButtonProps
 * @property {string} title - Texto a mostrar en el botón.
 * @property {() => void} onPress - Función a ejecutar al presionar el botón.
 * @property {ViewStyle} [style] - Estilos adicionales para el contenedor del botón.
 * @property {TextStyle} [textStyle] - Estilos adicionales para el texto del botón.
 */
interface StyledButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Componente de botón estilizado y reutilizable.
 * @param {StyledButtonProps} props - Propiedades del botón.
 * @returns {JSX.Element} Un componente TouchableOpacity con un texto.
 */
const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StyledButton;
