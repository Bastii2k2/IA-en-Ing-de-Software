// src/components/ui/DatePickerInput.tsx

import React, { useState } from 'react';
import { TextInput, StyleSheet, TouchableOpacity, Text, View, Platform, Modal } from 'react-native';
// Si usaras @react-native-community/datetimepicker, lo importarías aquí:
// import DateTimePicker from '@react-native-community/datetimepicker';

/**
 * @interface DatePickerInputProps
 * @description Propiedades para el componente DatePickerInput.
 * @property {string} value - El valor actual de la fecha (ej. "YYYY-MM-DD").
 * @property {(date: string) => void} onValueChange - Callback que se llama cuando la fecha cambia.
 * @property {string} [placeholder] - Texto de placeholder para el input.
 * @property {string} [label] - Etiqueta opcional para el campo.
 */
interface DatePickerInputProps {
  value: string;
  onValueChange: (date: string) => void;
  placeholder?: string;
  label?: string;
}

/**
 * @function DatePickerInput
 * @description Componente de entrada de fecha estilizado.
 * Simula la funcionalidad de un selector de fecha usando un TextInput
 * y un Modal básico para elegir una fecha si fuera necesario.
 * Para este ejercicio, se asume que el usuario introduce un formato válido
 * o se integra con un picker real (comentado).
 */
const DatePickerInput: React.FC<DatePickerInputProps> = ({ value, onValueChange, placeholder = 'YYYY-MM-DD', label }) => {
  // En un entorno real, manejarías la visibilidad de un DateTimePicker nativo.
  // Para este ejemplo, simplemente vamos a permitir la entrada manual y
  // podemos mostrar un placeholder que guíe al usuario.
  // Si se usara @react-native-community/datetimepicker:
  // const [showPicker, setShowPicker] = useState(false);
  // const [selectedDate, setSelectedDate] = useState(new Date());

  // const handleDateChange = (event: any, date?: Date) => {
  //   setShowPicker(Platform.OS === 'ios'); // En iOS, el picker no se cierra automáticamente
  //   if (date) {
  //     setSelectedDate(date);
  //     onValueChange(date.toISOString().split('T')[0]); // Formato YYYY-MM-DD
  //   }
  // };

  // const displayPicker = () => {
  //   setShowPicker(true);
  // };

  return (
    <View>
      {label && <Text style={styles.label}>{label}</Text>}
      <TouchableOpacity
        // En un caso real, esto abriría el picker
        // onPress={displayPicker}
        activeOpacity={0.8}
        style={styles.touchableWrapper}
      >
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          value={value}
          onChangeText={onValueChange} // Permite la entrada manual por ahora
          editable={true} // Permite escribir, o false si solo quieres picker
          keyboardType="number-pad" // Para fechas YYYY-MM-DD, números y guiones
          placeholderTextColor="#888"
        />
      </TouchableOpacity>

      {/* Aquí iría el DateTimePicker si estuviera instalado */}
      {/* {showPicker && (
        <DateTimePicker
          testID="dateTimePicker"
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
        />
      )} */}
      {/* O un modal con un picker personalizado */}
      {/* <Modal
        animationType="slide"
        transparent={true}
        visible={showPicker}
        onRequestClose={() => setShowPicker(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display="spinner" // O "compact", "inline"
              onChange={handleDateChange}
            />
            <Button title="Confirmar" onPress={() => setShowPicker(false)} />
          </View>
        </View>
      </Modal> */}
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: '500',
  },
  touchableWrapper: {
    borderRadius: 8,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
    fontSize: 16,
    color: '#333',
  },
  // Estilos para el modal si se usa uno personalizado
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    width: '90%',
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});

export default DatePickerInput;
