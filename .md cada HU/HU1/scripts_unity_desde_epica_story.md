Aquí tienes la arquitectura y el código para la implementación de la **Historia de Usuario 1: Registro de Información del Paciente**, siguiendo las mejores prácticas y el formato solicitado.

---

### Resumen de la Arquitectura

Esta arquitectura se basa en una estructura modular y escalable, utilizando React Native con TypeScript. Hemos diseñado la aplicación siguiendo principios de separación de responsabilidades:

1.  **Pantallas (Screens)**: Contienen la UI principal y orquestan la presentación de los componentes. `PatientRegistrationScreen` es el punto de entrada para el registro.
2.  **Componentes (Components)**: Pequeños componentes reutilizables y con propósito único (e.g., `StyledInput`, `Button`, `DatePickerInput`). Se dividen en `ui` para elementos básicos y `common` para componentes más complejos que encapsulan lógica de UI.
3.  **Hooks Personalizados (Hooks)**: Encapsulan la lógica de estado y comportamiento de formularios o funcionalidades específicas, como `usePatientForm`, para mantener las pantallas limpias y enfocadas en la composición de componentes.
4.  **Servicios (Services)**: Manejan la lógica de negocio y la interacción con fuentes de datos externas (APIs, almacenamiento local). `PatientService` simula la persistencia de datos del paciente utilizando `AsyncStorage`.
5.  **Tipos (Types)**: Definiciones de TypeScript para asegurar la consistencia y la seguridad de tipos en toda la aplicación.
6.  **Navegación (Navigation)**: Gestionada por `React Navigation`, definiendo las rutas y la estructura de navegación.

Este enfoque promueve la reusabilidad, la mantenibilidad y la testabilidad del código.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens):**
    *   `PatientRegistrationScreen`: La pantalla principal para que el administrador registre los datos de un nuevo paciente. Contiene el formulario de registro.

*   **Componentes Reutilizables (Components):**
    *   `ui/StyledInput`: Un componente de entrada de texto estilizado para campos generales del formulario.
    *   `ui/Button`: Un componente de botón reutilizable con estilos básicos.
    *   `ui/DatePickerInput`: Un componente de entrada para seleccionar fechas (ej. fecha de nacimiento). Utiliza un `TextInput` que, al ser presionado, simula la apertura de un selector de fecha y muestra la fecha seleccionada.
    *   `common/FormGroup`: Un componente contenedor que agrupa una etiqueta, un campo de formulario y un mensaje de error asociado, facilitando la construcción de formularios consistentes.

*   **Hooks Personalizados (Hooks):**
    *   `usePatientForm`: Un hook personalizado que gestiona el estado del formulario de registro de pacientes, incluyendo los datos, errores de validación, y las funciones para manejar cambios y envíos.

*   **Servicios (Services):**
    *   `PatientService`: Un servicio encargado de la lógica de negocio relacionada con los pacientes, como el registro. Simula el almacenamiento de datos en `AsyncStorage`.

*   **Tipos (Types):**
    *   `Patient.ts`: Define la interfaz `Patient` para tipar los datos de un paciente.
    *   `Form.ts`: Define la interfaz `PatientFormData` para el estado del formulario.

---

### 2) Estructura de Archivos

```
src/
├── App.tsx
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   └── PatientRegistrationScreen.tsx
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── DatePickerInput.tsx
│   │   └── StyledInput.tsx
│   └── common/
│       └── FormGroup.tsx
├── hooks/
│   └── usePatientForm.ts
├── services/
│   └── PatientService.ts
├── types/
│   ├── Patient.ts
│   └── Form.ts
└── utils/
    └── validation.ts
```

---

### 3) Código Fuente

Asumo que ya tienes un proyecto React Native configurado y las dependencias básicas instaladas: `react-native`, `react`, `react-navigation/native`, `react-navigation/stack`, `@react-native-async-storage/async-storage`.

```typescript filename=src/types/Patient.ts
// src/types/Patient.ts

/**
 * @interface Patient
 * @description Define la estructura de datos para un paciente.
 * @property {string} id - Identificador único del paciente.
 * @property {string} name - Nombre completo del paciente.
 * @property {string} dateOfBirth - Fecha de nacimiento del paciente en formato string (ej. 'YYYY-MM-DD').
 * @property {string} medicalHistory - Historial médico relevante del paciente (puede ser una cadena de texto larga).
 */
export interface Patient {
  id: string; // Un ID único para cada paciente
  name: string;
  dateOfBirth: string; // Formato string para la fecha
  medicalHistory: string;
}
```

```typescript filename=src/types/Form.ts
// src/types/Form.ts

import { Patient } from './Patient';

/**
 * @interface PatientFormData
 * @description Define la estructura de datos para el formulario de registro de pacientes.
 * Generalmente es similar a la interfaz Patient, pero sin el 'id' que se genera al guardar.
 */
export interface PatientFormData extends Omit<Patient, 'id'> {}

/**
 * @interface PatientFormErrors
 * @description Define la estructura para los errores de validación del formulario de registro de pacientes.
 * Las claves corresponden a los campos del formulario y los valores son los mensajes de error.
 */
export type PatientFormErrors = {
  [key in keyof PatientFormData]?: string;
};
```

```typescript filename=src/utils/validation.ts
// src/utils/validation.ts

import { PatientFormData } from '../types/Form';

/**
 * @function validatePatientForm
 * @description Realiza la validación de los datos del formulario de registro de pacientes.
 * @param {PatientFormData} formData - Los datos del formulario a validar.
 * @returns {PatientFormErrors} Un objeto con los mensajes de error para cada campo inválido.
 */
export const validatePatientForm = (formData: PatientFormData) => {
  const errors: { [key: string]: string } = {};

  // Validar nombre: requerido
  if (!formData.name.trim()) {
    errors.name = 'El nombre del paciente es obligatorio.';
  }

  // Validar fecha de nacimiento: requerida y formato básico (puede mejorarse con regex de fecha real)
  if (!formData.dateOfBirth.trim()) {
    errors.dateOfBirth = 'La fecha de nacimiento es obligatoria.';
  } else if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dateOfBirth)) {
    // Validar formato YYYY-MM-DD básico
    errors.dateOfBirth = 'Formato de fecha de nacimiento inválido (YYYY-MM-DD).';
  }

  // El historial médico es opcional, así que no se valida su presencia
  // Podríamos añadir validación de longitud si fuera necesario.

  return errors;
};
```

```typescript filename=src/services/PatientService.ts
// src/services/PatientService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient } from '../types/Patient';
import { PatientFormData } from '../types/Form';
import 'react-native-get-random-values'; // Importar para UUID en React Native
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

const PATIENTS_STORAGE_KEY = '@MediCS:patients';

/**
 * @class PatientService
 * @description Servicio para gestionar las operaciones relacionadas con los pacientes,
 * como el registro y la obtención de datos. Simula una API usando AsyncStorage.
 */
class PatientService {
  /**
   * @method registerPatient
   * @description Registra un nuevo paciente en el sistema.
   * Almacena los datos en AsyncStorage.
   * @param {PatientFormData} patientData - Los datos del nuevo paciente a registrar.
   * @returns {Promise<Patient>} Una promesa que resuelve con el paciente registrado (incluyendo su ID).
   */
  async registerPatient(patientData: PatientFormData): Promise<Patient> {
    try {
      // Simular un retraso de red
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generar un ID único para el paciente
      const newPatient: Patient = {
        id: uuidv4(),
        ...patientData,
      };

      // Obtener pacientes existentes
      const storedPatients = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
      const patients: Patient[] = storedPatients ? JSON.parse(storedPatients) : [];

      // Añadir el nuevo paciente
      patients.push(newPatient);

      // Guardar la lista actualizada de pacientes
      await AsyncStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));

      console.log('Paciente registrado con éxito:', newPatient);
      return newPatient;
    } catch (error) {
      console.error('Error al registrar paciente:', error);
      throw new Error('No se pudo registrar el paciente. Intente de nuevo.');
    }
  }

  /**
   * @method getPatients
   * @description Obtiene todos los pacientes registrados.
   * @returns {Promise<Patient[]>} Una promesa que resuelve con una lista de pacientes.
   */
  async getPatients(): Promise<Patient[]> {
    try {
      const storedPatients = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
      return storedPatients ? JSON.parse(storedPatients) : [];
    } catch (error) {
      console.error('Error al obtener pacientes:', error);
      throw new Error('No se pudieron cargar los pacientes.');
    }
  }

  // Podríamos añadir más métodos como updatePatient, deletePatient, getPatientById, etc.
}

export default new PatientService(); // Exportar una instancia única del servicio
```

```typescript filename=src/hooks/usePatientForm.ts
// src/hooks/usePatientForm.ts

import { useState } from 'react';
import { PatientFormData, PatientFormErrors } from '../types/Form';
import { validatePatientForm } from '../utils/validation';
import PatientService from '../services/PatientService';
import { Alert } from 'react-native';

/**
 * @function usePatientForm
 * @description Hook personalizado para gestionar el estado, la validación y el envío
 * del formulario de registro de pacientes.
 * @param {() => void} onSuccess - Función a ejecutar si el envío del formulario es exitoso.
 * @returns {object} Un objeto que contiene el estado del formulario, errores,
 * manejadores de eventos y la función de envío.
 */
export const usePatientForm = (onSuccess: () => void) => {
  // Estado para los datos del formulario
  const [formData, setFormData] = useState<PatientFormData>({
    name: '',
    dateOfBirth: '',
    medicalHistory: '',
  });

  // Estado para los errores de validación del formulario
  const [errors, setErrors] = useState<PatientFormErrors>({});

  // Estado para indicar si el formulario está en proceso de envío
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /**
   * @function handleChange
   * @description Actualiza el estado del formulario cuando un campo cambia.
   * @param {keyof PatientFormData} field - El nombre del campo que ha cambiado.
   * @param {string} value - El nuevo valor del campo.
   */
  const handleChange = (field: keyof PatientFormData, value: string) => {
    setFormData(prevData => ({
      ...prevData,
      [field]: value,
    }));
    // Limpiar el error del campo si el usuario empieza a escribir
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario. Valida los datos y, si son válidos,
   * llama al servicio para registrar el paciente.
   */
  const handleSubmit = async () => {
    // 1. Validar los datos del formulario
    const validationErrors = validatePatientForm(formData);
    setErrors(validationErrors);

    // 2. Si hay errores, no proceder con el envío
    if (Object.keys(validationErrors).length > 0) {
      Alert.alert(
        'Datos incompletos',
        'Por favor, complete todos los campos obligatorios.'
      );
      return;
    }

    // 3. Si los datos son válidos, intentar registrar el paciente
    setIsLoading(true);
    try {
      await PatientService.registerPatient(formData);
      Alert.alert('Éxito', 'Paciente registrado correctamente.');
      setFormData({ name: '', dateOfBirth: '', medicalHistory: '' }); // Limpiar formulario
      onSuccess(); // Ejecutar callback de éxito
    } catch (error: any) {
      Alert.alert('Error', error.message || 'Error al registrar el paciente.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    errors,
    isLoading,
    handleChange,
    handleSubmit,
  };
};
```

```typescript filename=src/components/ui/StyledInput.tsx
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
```

```typescript filename=src/components/ui/Button.tsx
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
```

```typescript filename=src/components/ui/DatePickerInput.tsx
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
```

```typescript filename=src/components/common/FormGroup.tsx
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
```

```typescript filename=src/screens/PatientRegistrationScreen.tsx
// src/screens/PatientRegistrationScreen.tsx

import React from 'react';
import { View, StyleSheet, ScrollView, Text, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { usePatientForm } from '../hooks/usePatientForm';
import FormGroup from '../components/common/FormGroup';
import StyledInput from '../components/ui/StyledInput';
import Button from '../components/ui/Button';
import DatePickerInput from '../components/ui/DatePickerInput';

// Definimos los tipos para la navegación
type RootStackParamList = {
  PatientRegistration: undefined;
  // Puedes añadir otras pantallas aquí si es necesario
};
type PatientRegistrationScreenProps = StackScreenProps<RootStackParamList, 'PatientRegistration'>;

/**
 * @function PatientRegistrationScreen
 * @description Pantalla para el registro de nuevos pacientes.
 * Utiliza el hook `usePatientForm` para gestionar el estado del formulario,
 * la validación y el envío.
 */
const PatientRegistrationScreen: React.FC<PatientRegistrationScreenProps> = () => {
  // Callback para cuando el formulario se envía con éxito.
  // En una app real, podrías navegar a otra pantalla, actualizar una lista, etc.
  const handleRegistrationSuccess = () => {
    console.log('Navegar o actualizar UI después del registro exitoso.');
    // Por ejemplo: navigation.goBack(); o Alert.alert('Éxito', 'Paciente registrado!');
  };

  // Inicializamos el hook usePatientForm
  const { formData, errors, isLoading, handleChange, handleSubmit } =
    usePatientForm(handleRegistrationSuccess);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Registrar Nuevo Paciente</Text>

      {/* Campo para el nombre del paciente */}
      <FormGroup label="Nombre Completo" error={errors.name}>
        <StyledInput
          placeholder="Ej: Juan Pérez"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
          autoCapitalize="words" // Capitaliza la primera letra de cada palabra
        />
      </FormGroup>

      {/* Campo para la fecha de nacimiento */}
      <FormGroup label="Fecha de Nacimiento (YYYY-MM-DD)" error={errors.dateOfBirth}>
        <DatePickerInput
          placeholder="Ej: 1990-01-15"
          value={formData.dateOfBirth}
          onValueChange={(date) => handleChange('dateOfBirth', date)}
        />
      </FormGroup>

      {/* Campo para el historial médico (TextArea) */}
      <FormGroup label="Historial Médico">
        <StyledInput
          placeholder="Ej: Alergia a la penicilina, asma infantil..."
          value={formData.medicalHistory}
          onChangeText={(text) => handleChange('medicalHistory', text)}
          multiline // Permite múltiples líneas de texto
          numberOfLines={4} // Altura inicial para 4 líneas
          style={styles.textArea} // Estilo específico para el área de texto
        />
      </FormGroup>

      {/* Botón para enviar el formulario */}
      <Button
        title="Registrar Paciente"
        onPress={handleSubmit}
        isLoading={isLoading}
        style={styles.button}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#343a40',
    marginBottom: 30,
    textAlign: 'center',
  },
  textArea: {
    height: 100, // Altura fija para el historial médico
    textAlignVertical: 'top', // Para que el texto empiece arriba
  },
  button: {
    marginTop: 20,
  },
});

export default PatientRegistrationScreen;
```

```typescript filename=src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PatientRegistrationScreen from '../screens/PatientRegistrationScreen';

// Definimos los tipos para los parámetros de las rutas de nuestro Stack Navigator.
// Esto permite que TypeScript sepa qué props esperar en cada pantalla.
type RootStackParamList = {
  PatientRegistration: undefined; // La pantalla de registro no espera parámetros iniciales.
  // Aquí puedes añadir más pantallas a medida que la aplicación crezca, por ejemplo:
  // PatientList: undefined;
  // PatientDetail: { patientId: string };
};

// Creamos un Stack Navigator.
const Stack = createStackNavigator<RootStackParamList>();

/**
 * @function AppNavigator
 * @description Componente principal de navegación de la aplicación.
 * Envuelve todas las pantallas en un Stack Navigator para la navegación.
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PatientRegistration">
        {/*
          Definimos la pantalla de registro de pacientes.
          `component` apunta al componente de la pantalla.
          `options` permite configurar el título de la barra superior.
        */}
        <Stack.Screen
          name="PatientRegistration"
          component={PatientRegistrationScreen}
          options={{ title: 'Registro de Pacientes' }}
        />
        {/* Aquí se añadirían más pantallas */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

```typescript filename=src/App.tsx
// src/App.tsx

import React from 'react';
import AppNavigator from './navigation/AppNavigator';

/**
 * @function App
 * @description Componente raíz de la aplicación React Native.
 * Su única responsabilidad es renderizar el navegador principal.
 */
const App: React.FC = () => {
  return (
    // AppNavigator contiene la lógica de React Navigation y todas las pantallas.
    <AppNavigator />
  );
};

export default App;
```