// src/components/StyledButton.tsx
/**
 * @file Componente de botón estilizado y reutilizable.
 */
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

interface StyledButtonProps {
  title: string;
  onPress: () => void;
  isLoading?: boolean;
  style?: ViewStyle;
  textStyle?: TextStyle;
  disabled?: boolean;
}

const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, isLoading = false, style, textStyle, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, (isLoading || disabled) && styles.buttonDisabled]}
      onPress={onPress}
      disabled={isLoading || disabled}
      activeOpacity={0.7}
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
  },
  buttonDisabled: {
    backgroundColor: '#a0c7ff',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StyledButton;
