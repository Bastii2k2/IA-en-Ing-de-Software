// src/components/common/DropdownPicker.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Picker } from '@react-native-picker/picker'; // Requiere instalación: @react-native-picker/picker
import { Patient, Medication } from '../../types'; // Importa los tipos necesarios

/**
 * @interface DropdownPickerProps
 * @description Props para el componente DropdownPicker.
 */
interface DropdownPickerProps {
  label: string;
  selectedValue: string;
  onValueChange: (itemValue: string, itemIndex: number) => void;
  items: (Patient | Medication)[]; // Puede aceptar pacientes o medicamentos
  placeholder?: string;
}

/**
 * @function DropdownPicker
 * @description Componente Dropdown (Picker) estilizado para selección de elementos.
 * @param {DropdownPickerProps} props - Propiedades para el Dropdown.
 * @returns {JSX.Element} Un componente Picker con etiqueta y estilos.
 */
const DropdownPicker: React.FC<DropdownPickerProps> = ({
  label,
  selectedValue,
  onValueChange,
  items,
  placeholder = 'Seleccione...',
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={selectedValue}
          onValueChange={onValueChange}
          style={styles.picker}
          itemStyle={styles.pickerItem}
        >
          <Picker.Item label={placeholder} value="" />
          {items.map((item) => (
            <Picker.Item key={item.id} label={item.name} value={item.id} />
          ))}
        </Picker>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#333',
  },
  pickerContainer: {
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    backgroundColor: '#fff',
    overflow: 'hidden', // Para asegurar que el borde redondeado se vea bien
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#333',
  },
  pickerItem: {
    fontSize: 16,
  },
});

export default DropdownPicker;
