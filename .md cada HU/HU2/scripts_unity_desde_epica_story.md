Aquí tienes el diseño de la arquitectura y el código para la Historia de Usuario 2: Actualización de Información del Paciente.

---

### Resumen de la Arquitectura

La arquitectura propuesta sigue un enfoque modular y basado en la separación de responsabilidades, utilizando los principios de React Native y TypeScript.

1.  **Pantallas (Screens):** `PatientEditScreen` será la pantalla principal para esta HU. Se encargará de orquestar la carga de datos del paciente, la presentación del formulario y la interacción con los servicios.
2.  **Componentes Reutilizables (Components):** Se reutilizará el componente `PatientForm` (asumiendo que fue creado para HU1), `StyledInput` y `Button`. Se añadirán componentes genéricos como `LoadingIndicator`, `ErrorMessage` y `SuccessMessage` para retroalimentación al usuario.
3.  **Hooks Personalizados (Hooks):**
    *   `usePatientForm`: Encapsula la lógica del formulario (estado, validación, manejo de cambios) y es reutilizable tanto para registro como para edición.
    *   `useAuth`: Simula la gestión de roles y permisos, lo que permite verificar si el usuario tiene autorización para realizar ciertas acciones (como actualizar un paciente).
4.  **Servicios (Services):**
    *   `PatientService`: Contendrá métodos para interactuar con los datos de los pacientes, incluyendo `getPatientById` para cargar datos existentes y `updatePatient` para guardar los cambios. La persistencia se simula con `AsyncStorage`.
    *   `AuthService`: Gestiona la simulación de roles de usuario y permisos.
5.  **Tipos (Types):** Se definirá una interfaz `Patient` para asegurar la consistencia de los datos.
6.  **Navegación:** Se asumirá `React Navigation` y se mostrará cómo `PatientEditScreen` recibiría el `patientId` a través de los parámetros de ruta.

Este diseño promueve la testabilidad, la mantenibilidad y la escalabilidad, evitando "God Components" y fomentando la composición.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens):**
    *   `PatientEditScreen`: Carga los datos de un paciente específico, los muestra en `PatientForm`, permite modificarlos y los guarda a través de `PatientService.updatePatient`. Maneja estados de carga, errores, éxito y verifica permisos.

*   **Componentes Reutilizables (Components):**
    *   `PatientForm`: Componente de formulario genérico que acepta `initialValues` y una función `onSubmit`. Contiene los `StyledInput` y `Button`.
    *   `StyledInput`: Componente básico de entrada de texto estilizado.
    *   `Button`: Componente de botón estilizado.
    *   `LoadingIndicator`: Componente simple para mostrar un spinner de carga.
    *   `ErrorMessage`: Componente para mostrar mensajes de error.
    *   `SuccessMessage`: Componente para mostrar mensajes de éxito.

*   **Hooks Personalizados (Hooks):**
    *   `usePatientForm`: Hook para gestionar el estado, validación y envío de cualquier formulario de paciente. Acepta `initialValues` para prellenar el formulario.
    *   `useAuth`: Hook para obtener el rol del usuario actual y verificar permisos.

*   **Servicios (Services):**
    *   `PatientService`: Ofrece métodos para `getPatientById` y `updatePatient`. Utiliza `AsyncStorage` para simular una base de datos local.
    *   `AuthService`: Proporciona la lógica para simular roles de usuario (`admin`, `guest`) y la verificación de permisos.

*   **Tipos (Types):**
    *   `Patient`: Interfaz TypeScript para definir la estructura de un objeto paciente.
    *   `PatientFormData`: Interfaz para los datos del formulario de paciente.

---

### 2) Estructura de Archivos

```
src/
├── components/
│   ├── Button.tsx
│   ├── ErrorMessage.tsx
│   ├── LoadingIndicator.tsx
│   ├── PatientForm.tsx
│   ├── StyledInput.tsx
│   └── SuccessMessage.tsx
├── hooks/
│   ├── useAuth.ts
│   └── usePatientForm.ts
├── navigation/
│   └── AppNavigator.tsx        // Define la estructura de navegación
├── screens/
│   └── PatientEditScreen.tsx
├── services/
│   ├── AuthService.ts
│   └── PatientService.ts
└── types/
    └── patient.ts
```

---

### 3) Código Fuente (y 4) Mejores Prácticas, 5) Comentarios)

A continuación, el código para cada archivo.

```typescript filename=src/types/patient.ts
// src/types/patient.ts
/**
 * @interface Patient
 * Define la estructura de un objeto paciente en la aplicación.
 */
export interface Patient {
  id: string;
  name: string;
  dob: string; // Date of Birth en formato YYYY-MM-DD
  medicalHistory: string;
  // Otros campos que puedan ser necesarios
}

/**
 * @interface PatientFormData
 * Define la estructura de los datos que maneja el formulario de paciente.
 * Es similar a 'Patient' pero sin 'id', ya que el ID se gestiona fuera del formulario.
 */
export interface PatientFormData {
  name: string;
  dob: string;
  medicalHistory: string;
}
```

```typescript filename=src/components/StyledInput.tsx
// src/components/StyledInput.tsx
import React from 'react';
import { TextInput, StyleSheet, Text, View } from 'react-native';

interface StyledInputProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: 'default' | 'numeric' | 'email-address' | 'phone-pad';
  error?: string; // Propiedad para mostrar errores de validación
  multiline?: boolean; // Para permitir inputs de varias líneas
  numberOfLines?: number; // Para el número de líneas inicial en multiline
}

/**
 * Componente de entrada de texto estilizado y reutilizable.
 * Incluye una etiqueta y la capacidad de mostrar mensajes de error.
 */
export const StyledInput: React.FC<StyledInputProps> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry = false,
  keyboardType = 'default',
  error,
  multiline = false,
  numberOfLines = 1,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && styles.multilineInput, error && styles.inputError]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        keyboardType={keyboardType}
        multiline={multiline}
        numberOfLines={numberOfLines}
        textAlignVertical={multiline ? 'top' : 'center'} // Alinea el texto en la parte superior para multiline
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    fontWeight: 'bold',
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  multilineInput: {
    height: 100, // Altura predeterminada para multiline
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});
```

```typescript filename=src/components/Button.tsx
// src/components/Button.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';

interface ButtonProps {
  title: string;
  onPress: () => void;
  disabled?: boolean;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
}

/**
 * Componente de botón estilizado y reutilizable.
 * Soporta estados de deshabilitado y carga, y diferentes variantes.
 */
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  disabled = false,
  loading = false,
  variant = 'primary',
}) => {
  const buttonStyles = [
    styles.button,
    styles[variant],
    (disabled || loading) && styles.buttonDisabled,
  ];
  const textStyles = [styles.buttonText, styles[`${variant}Text`]];

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={onPress}
      disabled={disabled || loading}
    >
      {loading ? (
        <ActivityIndicator color="#fff" />
      ) : (
        <Text style={textStyles}>{title}</Text>
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
    minWidth: 120, // Ancho mínimo para consistencia
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
  buttonDisabled: {
    backgroundColor: '#a0a0a0',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  primaryText: {
    color: '#fff',
  },
  secondaryText: {
    color: '#fff',
  },
  dangerText: {
    color: '#fff',
  },
});
```

```typescript filename=src/components/LoadingIndicator.tsx
// src/components/LoadingIndicator.tsx
import React from 'react';
import { ActivityIndicator, StyleSheet, View, Text } from 'react-native';

interface LoadingIndicatorProps {
  message?: string;
  size?: 'small' | 'large';
  color?: string;
}

/**
 * Componente para mostrar un indicador de carga.
 * Útil para operaciones asíncronas, como la carga de datos.
 */
export const LoadingIndicator: React.FC<LoadingIndicatorProps> = ({
  message = 'Cargando...',
  size = 'large',
  color = '#007bff',
}) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size={size} color={color} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  message: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
});
```

```typescript filename=src/components/ErrorMessage.tsx
// src/components/ErrorMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ErrorMessageProps {
  message: string;
}

/**
 * Componente para mostrar mensajes de error al usuario.
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  if (!message) return null; // No muestra nada si no hay mensaje

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8d7da',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
    marginVertical: 10,
    alignItems: 'center',
  },
  message: {
    color: '#721c24',
    fontSize: 16,
    textAlign: 'center',
  },
});
```

```typescript filename=src/components/SuccessMessage.tsx
// src/components/SuccessMessage.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SuccessMessageProps {
  message: string;
}

/**
 * Componente para mostrar mensajes de éxito al usuario.
 */
export const SuccessMessage: React.FC<SuccessMessageProps> = ({ message }) => {
  if (!message) return null; // No muestra nada si no hay mensaje

  return (
    <View style={styles.container}>
      <Text style={styles.message}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#d4edda',
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#c3e6cb',
    marginVertical: 10,
    alignItems: 'center',
  },
  message: {
    color: '#155724',
    fontSize: 16,
    textAlign: 'center',
  },
});
```

```typescript filename=src/hooks/usePatientForm.ts
// src/hooks/usePatientForm.ts
import { useState, useCallback } from 'react';
import { PatientFormData } from '../types/patient';

interface UsePatientFormProps {
  initialValues: PatientFormData;
  onSubmit: (data: PatientFormData) => Promise<void>;
}

interface UsePatientFormResult {
  values: PatientFormData;
  errors: { [key: string]: string };
  handleChange: (field: keyof PatientFormData, value: string) => void;
  handleSubmit: () => Promise<void>;
  isSubmitting: boolean;
  resetForm: () => void;
}

/**
 * Hook personalizado para gestionar la lógica de un formulario de paciente.
 * Maneja el estado de los valores del formulario, errores de validación y el estado de envío.
 * Puede ser utilizado tanto para crear como para editar pacientes, gracias a `initialValues`.
 */
export const usePatientForm = ({ initialValues, onSubmit }: UsePatientFormProps): UsePatientFormResult => {
  const [values, setValues] = useState<PatientFormData>(initialValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Función para manejar el cambio de valores en los campos del formulario
  const handleChange = useCallback((field: keyof PatientFormData, value: string) => {
    setValues(prevValues => ({ ...prevValues, [field]: value }));
    // Limpiar el error para el campo modificado si existe
    if (errors[field]) {
      setErrors(prevErrors => {
        const newErrors = { ...prevErrors };
        delete newErrors[field];
        return newErrors;
      });
    }
  }, [errors]);

  // Función para validar los datos del formulario
  const validate = (data: PatientFormData) => {
    const newErrors: { [key: string]: string } = {};
    if (!data.name.trim()) newErrors.name = 'El nombre es obligatorio.';
    if (!data.dob.trim()) newErrors.dob = 'La fecha de nacimiento es obligatoria.';
    // Simple validación de formato de fecha YYYY-MM-DD
    else if (!/^\d{4}-\d{2}-\d{2}$/.test(data.dob)) newErrors.dob = 'Formato de fecha inválido (YYYY-MM-DD).';
    if (!data.medicalHistory.trim()) newErrors.medicalHistory = 'El historial médico es obligatorio.';
    return newErrors;
  };

  // Función para manejar el envío del formulario
  const handleSubmit = useCallback(async () => {
    const validationErrors = validate(values);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } catch (e) {
        console.error('Error submitting form:', e);
        // Podríamos manejar errores específicos aquí o dejar que la pantalla los maneje
      } finally {
        setIsSubmitting(false);
      }
    }
  }, [values, onSubmit]);

  // Función para resetear el formulario a sus valores iniciales
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setIsSubmitting(false);
  }, [initialValues]);

  return {
    values,
    errors,
    handleChange,
    handleSubmit,
    isSubmitting,
    resetForm,
  };
};
```

```typescript filename=src/components/PatientForm.tsx
// src/components/PatientForm.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { PatientFormData } from '../types/patient';
import { usePatientForm } from '../hooks/usePatientForm';
import { StyledInput } from './StyledInput';
import { Button } from './Button';

interface PatientFormProps {
  initialValues: PatientFormData; // Valores iniciales para editar
  onSubmit: (data: PatientFormData) => Promise<void>;
  submitButtonText: string;
  isSubmitting?: boolean; // Propiedad para indicar si la pantalla ya está en estado de envío
}

/**
 * Componente de formulario genérico para registro y edición de pacientes.
 * Reutiliza el hook `usePatientForm` para la lógica y `StyledInput` para los campos.
 */
export const PatientForm: React.FC<PatientFormProps> = ({
  initialValues,
  onSubmit,
  submitButtonText,
  isSubmitting: isSubmittingFromParent = false, // Permite que la pantalla controle el estado de envío
}) => {
  // Utilizamos el hook personalizado para manejar el estado del formulario y la validación
  const { values, errors, handleChange, handleSubmit, isSubmitting: isSubmittingFromHook } = usePatientForm({
    initialValues,
    onSubmit,
  });

  // El botón estará deshabilitado si el formulario está siendo enviado (desde el hook o desde el padre)
  const isDisabled = isSubmittingFromParent || isSubmittingFromHook;

  return (
    <View style={styles.container}>
      <StyledInput
        label="Nombre Completo"
        value={values.name}
        onChangeText={(text) => handleChange('name', text)}
        placeholder="Ej: Juan Pérez"
        error={errors.name}
      />
      <StyledInput
        label="Fecha de Nacimiento (YYYY-MM-DD)"
        value={values.dob}
        onChangeText={(text) => handleChange('dob', text)}
        placeholder="Ej: 1990-01-15"
        keyboardType="numeric"
        error={errors.dob}
      />
      <StyledInput
        label="Historial Médico"
        value={values.medicalHistory}
        onChangeText={(text) => handleChange('medicalHistory', text)}
        placeholder="Alergias, condiciones preexistentes..."
        multiline
        numberOfLines={4}
        error={errors.medicalHistory}
      />

      <Button
        title={submitButtonText}
        onPress={handleSubmit}
        disabled={isDisabled}
        loading={isDisabled}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
```

```typescript filename=src/services/AuthService.ts
// src/services/AuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'admin' | 'guest' | null;

const CURRENT_USER_ROLE_KEY = 'currentUserRole';

/**
 * @class AuthService
 * Servicio para simular la gestión de autenticación y roles de usuario.
 * Utiliza AsyncStorage para "persistir" el rol del usuario entre sesiones.
 */
class AuthService {
  private currentUserRole: UserRole = null;

  constructor() {
    this.loadCurrentUserRole(); // Carga el rol al inicializar el servicio
  }

  /**
   * Carga el rol del usuario desde AsyncStorage.
   * Esto simula que el rol persiste entre las aperturas de la app.
   */
  private async loadCurrentUserRole() {
    try {
      const storedRole = await AsyncStorage.getItem(CURRENT_USER_ROLE_KEY);
      if (storedRole === 'admin' || storedRole === 'guest') {
        this.currentUserRole = storedRole;
        console.log('AuthService: Rol cargado:', this.currentUserRole);
      } else {
        this.currentUserRole = 'guest'; // Rol por defecto si no hay nada guardado o es inválido
        await AsyncStorage.setItem(CURRENT_USER_ROLE_KEY, 'guest');
        console.log('AuthService: Rol por defecto establecido como "guest".');
      }
    } catch (error) {
      console.error('Error al cargar el rol del usuario desde AsyncStorage:', error);
      this.currentUserRole = 'guest'; // Fallback en caso de error
    }
  }

  /**
   * Establece el rol del usuario actual y lo guarda en AsyncStorage.
   * @param role El rol a establecer ('admin' o 'guest').
   */
  public async login(role: 'admin' | 'guest') {
    this.currentUserRole = role;
    await AsyncStorage.setItem(CURRENT_USER_ROLE_KEY, role);
    console.log('AuthService: Usuario loggeado como:', role);
  }

  /**
   * Cierra la sesión del usuario, estableciendo el rol a nulo y eliminándolo de AsyncStorage.
   */
  public async logout() {
    this.currentUserRole = null;
    await AsyncStorage.removeItem(CURRENT_USER_ROLE_KEY);
    console.log('AuthService: Sesión cerrada.');
  }

  /**
   * Obtiene el rol del usuario actual.
   * @returns El rol del usuario ('admin', 'guest' o null).
   */
  public getCurrentUserRole(): UserRole {
    return this.currentUserRole;
  }

  /**
   * Verifica si el usuario actual tiene un permiso específico.
   * Esto simula la lógica de autorización.
   * @param permission El permiso a verificar (ej: 'update_patient', 'view_patient').
   * @returns `true` si el usuario tiene el permiso, `false` en caso contrario.
   */
  public hasPermission(permission: 'update_patient' | 'view_patient'): boolean {
    // Para esta HU, solo el 'admin' puede 'update_patient'.
    // Otros permisos pueden ser añadidos aquí.
    if (permission === 'update_patient') {
      return this.currentUserRole === 'admin';
    }
    // Por defecto, permitir ver pacientes a todos
    if (permission === 'view_patient') {
      return this.currentUserRole === 'admin' || this.currentUserRole === 'guest';
    }
    return false;
  }
}

// Exporta una instancia única del servicio para usarlo en toda la aplicación (Singleton)
export const authService = new AuthService();
```

```typescript filename=src/hooks/useAuth.ts
// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

type UserRole = 'admin' | 'guest' | null;

/**
 * Hook personalizado para acceder fácilmente a la información de autenticación y permisos.
 * Proporciona el rol del usuario actual y una función para verificar permisos.
 */
export const useAuth = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(authService.getCurrentUserRole());
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      // Forzamos la carga inicial del rol si no está ya disponible
      await authService['loadCurrentUserRole'](); // Acceso a método privado para asegurar la carga
      setCurrentUserRole(authService.getCurrentUserRole());
      setIsLoadingAuth(false);
    };

    loadRole();

    // En un entorno real, aquí se podría suscribir a cambios en el estado de autenticación
    // Por simplicidad, para este ejemplo, re-cargamos una vez.
  }, []);

  const hasPermission = (permission: 'update_patient' | 'view_patient') => {
    return authService.hasPermission(permission);
  };

  const login = async (role: 'admin' | 'guest') => {
    await authService.login(role);
    setCurrentUserRole(authService.getCurrentUserRole());
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUserRole(null);
  };

  return {
    currentUserRole,
    isLoadingAuth,
    hasPermission,
    login,
    logout,
  };
};
```

```typescript filename=src/services/PatientService.ts
// src/services/PatientService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient, PatientFormData } from '../types/patient';
import { v4 as uuidv4 } from 'uuid'; // Para generar IDs únicos

const PATIENTS_STORAGE_KEY = 'medics_patients';

// Simula un retardo de red
const simulateNetworkDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * @class PatientService
 * Servicio encargado de la lógica de negocio y la persistencia de los datos de pacientes.
 * Utiliza AsyncStorage para simular un almacenamiento local persistente.
 */
class PatientService {
  private async getStoredPatients(): Promise<Patient[]> {
    try {
      const patientsJson = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
      return patientsJson ? JSON.parse(patientsJson) : [];
    } catch (error) {
      console.error('Error al obtener pacientes de AsyncStorage:', error);
      return [];
    }
  }

  private async savePatients(patients: Patient[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (error) {
      console.error('Error al guardar pacientes en AsyncStorage:', error);
      throw new Error('No se pudieron guardar los datos del paciente.');
    }
  }

  /**
   * Simula la creación de un paciente (asumiendo que viene de HU1).
   * @param data Los datos del paciente a registrar.
   * @returns El paciente registrado con un ID.
   */
  public async registerPatient(data: PatientFormData): Promise<Patient> {
    await simulateNetworkDelay(500); // Simula carga
    const patients = await this.getStoredPatients();
    const newPatient: Patient = {
      id: uuidv4(), // Genera un ID único
      ...data,
    };
    patients.push(newPatient);
    await this.savePatients(patients);
    return newPatient;
  }

  /**
   * Obtiene un paciente por su ID.
   * @param id El ID del paciente a buscar.
   * @returns El objeto Patient si se encuentra, de lo contrario lanza un error.
   */
  public async getPatientById(id: string): Promise<Patient> {
    await simulateNetworkDelay(700); // Simula carga
    const patients = await this.getStoredPatients();
    const patient = patients.find(p => p.id === id);
    if (!patient) {
      throw new Error('Paciente no encontrado');
    }
    return patient;
  }

  /**
   * Actualiza la información de un paciente existente.
   * @param id El ID del paciente a actualizar.
   * @param updatedData Los nuevos datos del paciente.
   * @returns El paciente actualizado.
   */
  public async updatePatient(id: string, updatedData: PatientFormData): Promise<Patient> {
    await simulateNetworkDelay(1000); // Simula carga y procesamiento de la API
    let patients = await this.getStoredPatients();
    const patientIndex = patients.findIndex(p => p.id === id);

    if (patientIndex === -1) {
      throw new Error('Paciente no encontrado para actualizar');
    }

    const updatedPatient: Patient = {
      ...patients[patientIndex],
      ...updatedData, // Sobreescribe los campos con los nuevos datos
    };

    patients[patientIndex] = updatedPatient;
    await this.savePatients(patients);
    return updatedPatient;
  }

  /**
   * Función para inicializar algunos datos de prueba en AsyncStorage.
   * Útil para probar la app sin necesidad de un registro inicial.
   */
  public async seedPatients(): Promise<void> {
    const existingPatients = await this.getStoredPatients();
    if (existingPatients.length === 0) {
      const patient1: Patient = {
        id: 'patient-123',
        name: 'Ana María López',
        dob: '1985-03-20',
        medicalHistory: 'Alergia a la penicilina, asma leve.',
      };
      const patient2: Patient = {
        id: 'patient-456',
        name: 'Carlos Andrés Gómez',
        dob: '1978-11-05',
        medicalHistory: 'Hipertensión controlada, cirugía de apéndice en 2000.',
      };
      await this.savePatients([patient1, patient2]);
      console.log('Pacientes de prueba inicializados.');
    }
  }
}

// Exporta una instancia única del servicio (Singleton)
export const patientService = new PatientService();
```

```typescript filename=src/screens/PatientEditScreen.tsx
// src/screens/PatientEditScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { patientService } from '../services/PatientService';
import { Patient, PatientFormData } from '../types/patient';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import { PatientForm } from '../components/PatientForm';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button'; // Importamos Button para los botones de rol de prueba

// Define los parámetros de la pila de navegación
type RootStackParamList = {
  PatientEdit: { patientId: string };
  // Otras pantallas...
};

type PatientEditScreenProps = StackScreenProps<RootStackParamList, 'PatientEdit'>;

/**
 * Pantalla para editar la información de un paciente existente.
 * Carga los datos, utiliza el `PatientForm` para la edición y actualiza los datos.
 * Maneja permisos y muestra retroalimentación al usuario.
 */
export const PatientEditScreen: React.FC<PatientEditScreenProps> = ({ route, navigation }) => {
  const { patientId } = route.params; // Obtenemos el ID del paciente de los parámetros de navegación

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hook para la gestión de autenticación y permisos
  const { currentUserRole, isLoadingAuth, hasPermission, login, logout } = useAuth();

  // Valores iniciales para el formulario, se usan si el paciente aún no se ha cargado
  const initialFormValues: PatientFormData = {
    name: '',
    dob: '',
    medicalHistory: '',
  };

  /**
   * Carga los datos del paciente cuando la pantalla se monta o el ID del paciente cambia.
   */
  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const fetchedPatient = await patientService.getPatientById(patientId);
        setPatient(fetchedPatient);
      } catch (err) {
        console.error('Error al cargar paciente:', err);
        setError('No se pudo cargar la información del paciente. Por favor, intente de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();

    // Inicializar pacientes de prueba si no existen (solo para demostración)
    patientService.seedPatients();
  }, [patientId]);

  /**
   * Maneja el envío del formulario para actualizar el paciente.
   * Incluye la verificación de permisos.
   * @param updatedData Los datos del formulario que se van a guardar.
   */
  const handleUpdatePatient = async (updatedData: PatientFormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    // Gherkin: "Intento de actualización sin permisos"
    if (!hasPermission('update_patient')) {
      setError('Acceso denegado: No tienes permisos para actualizar la información del paciente.');
      setIsUpdating(false);
      return;
    }

    try {
      if (!patientId) {
        throw new Error('ID de paciente no disponible para la actualización.');
      }
      await patientService.updatePatient(patientId, updatedData);
      setSuccessMessage('Información del paciente actualizada exitosamente.');
      // Opcional: navegar a la pantalla de detalles del paciente o a una lista
      // navigation.goBack();
    } catch (err: any) {
      console.error('Error al actualizar paciente:', err);
      setError(`Error al guardar los cambios: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Muestra un indicador de carga mientras se cargan los datos del paciente o la autenticación
  if (isLoading || isLoadingAuth) {
    return <LoadingIndicator message="Cargando datos del paciente..." />;
  }

  // Si hay un error y no hay paciente cargado, muestra el error
  if (error && !patient) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage message={error} />
        {/* Botones para cambiar de rol para probar el escenario de permisos */}
        <View style={styles.roleButtons}>
          <Button title="Login como Admin" onPress={() => login('admin')} disabled={currentUserRole === 'admin'} />
          <Button title="Login como Invitado" onPress={() => login('guest')} disabled={currentUserRole === 'guest'} variant="secondary" />
        </View>
      </View>
    );
  }

  // Si el paciente no se encontró o hubo un error fatal
  if (!patient) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage message="Paciente no encontrado o hubo un problema al cargar. Contacte a soporte." />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Mostrar el rol actual del usuario para fines de depuración */}
        <Text style={styles.roleText}>Rol Actual: {currentUserRole || 'Ninguno'}</Text>
        <View style={styles.roleButtons}>
          <Button title="Login como Admin" onPress={() => login('admin')} disabled={currentUserRole === 'admin'} />
          <Button title="Login como Invitado" onPress={() => login('guest')} disabled={currentUserRole === 'guest'} variant="secondary" />
        </View>

        {successMessage && <SuccessMessage message={successMessage} />}
        {error && <ErrorMessage message={error} />}

        {/* El formulario del paciente, pre-rellenado con los datos existentes */}
        <PatientForm
          initialValues={{
            name: patient.name,
            dob: patient.dob,
            medicalHistory: patient.medicalHistory,
          }}
          onSubmit={handleUpdatePatient}
          submitButtonText="Guardar Cambios"
          isSubmitting={isUpdating}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#eef2f7',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
  },
});
```

```typescript filename=src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { PatientEditScreen } from '../screens/PatientEditScreen';

// Definición de tipos para los parámetros de ruta en el Stack Navigator
export type RootStackParamList = {
  Home: undefined; // Ejemplo de una pantalla Home
  PatientEdit: { patientId: string };
  // Añadir otras pantallas aquí a medida que se desarrollen
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Componente principal de navegación de la aplicación.
 * Define las pantallas y sus rutas.
 */
export const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        {/* Puedes añadir una pantalla de inicio real aquí si la tienes */}
        <Stack.Screen
          name="Home"
          component={() => (
            // Este es un placeholder simple para poder navegar a PatientEdit.
            // En una aplicación real, aquí tendrías tu HomeScreen con una lista de pacientes, etc.
            <PatientEditScreen route={{ params: { patientId: 'patient-123' }, key: 'dummy', name: 'PatientEdit'}} navigation={{} as any} />
          )}
          options={{ title: 'MediCS Home (Demo)' }}
        />
        <Stack.Screen
          name="PatientEdit"
          component={PatientEditScreen}
          options={{ title: 'Editar Paciente' }}
        />
        {/* Otras pantallas se agregarán aquí */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
```