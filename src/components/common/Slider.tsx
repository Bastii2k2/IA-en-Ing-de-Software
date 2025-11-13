// src/components/common/Slider.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
// Se usa @react-native-community/slider para un control deslizante estándar y robusto.
// Asegúrate de instalarlo: npm install @react-native-community/slider
import RNSlider from '@react-native-community/slider';
import { colors } from '../../theme/colors';

/**
 * @interface SliderProps
 * @property {string} label - Etiqueta descriptiva para el slider.
 * @property {number} value - Valor actual del slider.
 * @property {(value: number) => void} onValueChange - Función callback que se ejecuta al cambiar el valor.
 * @property {number} minimumValue - Valor mínimo del slider.
 * @property {number} maximumValue - Valor máximo del slider.
 * @property {number} [step] - Incremento o decremento de los valores del slider (por defecto 0).
 * @property {ViewStyle} [style] - Estilos adicionales para el contenedor del slider.
 * @property {TextStyle} [labelStyle] - Estilos adicionales para la etiqueta.
 */
interface SliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

/**
 * Componente de Slider reutilizable con etiqueta.
 * @param {SliderProps} props - Propiedades del slider.
 * @returns {JSX.Element} Un componente View que contiene la etiqueta y el RNSlider.
 */
const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 0, // Default step 0 means any float value
  style,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, labelStyle]}>{label}: {value.toFixed(1)}</Text>
      <RNSlider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.lightGray}
        thumbTintColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.dark,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default Slider;
