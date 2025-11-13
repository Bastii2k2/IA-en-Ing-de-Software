Aquí tienes la arquitectura propuesta y el código React Native (TypeScript) para la "Historia de Usuario 6: Generación de Recetas Electrónicas".

---

## Resumen de la Arquitectura para la Generación de Recetas Electrónicas

La arquitectura se centra en la **separación de responsabilidades** y la **reutilización de componentes**.

1.  **Capa de Presentación (Screens & Components)**:
    *   `PrescriptionGeneratorScreen`: La pantalla principal que orquesta la lógica y la UI para la creación de recetas. Se encarga de cargar los datos iniciales (pacientes, medicamentos) y de gestionar la interacción con el servicio de generación de recetas.
    *   `PrescriptionForm`: Un componente de UI reutilizable que encapsula el formulario para seleccionar el paciente y añadir/editar medicamentos. Recibe sus datos y funciones de manejo desde la pantalla contenedora.
    *   `MedicationItemForm`: Un componente más pequeño que gestiona la entrada de datos para un único medicamento dentro de la receta (nombre, dosis, instrucciones).
    *   `Button`, `StyledInput`, `DropdownPicker`: Componentes UI genéricos y reutilizables para elementos básicos del formulario.

2.  **Capa de Lógica de Negocio y Estado (Hooks)**:
    *   `usePrescriptionFormLogic`: Un hook personalizado que gestiona el estado complejo del formulario de receta (paciente seleccionado, lista de medicamentos con sus detalles) y las acciones relacionadas (añadir, actualizar, eliminar medicamentos, validar). Esto desacopla la lógica del formulario de la UI del `PrescriptionForm`.

3.  **Capa de Servicios (Services)**:
    *   `PatientService`: Simula la obtención de datos de pacientes. En una aplicación real, interactuaría con una API.
    *   `MedicationService`: Simula la obtención de datos de medicamentos. Similarmente, interactuaría con una API real.
    *   `PrescriptionService`: Contiene la lógica para "generar" la receta, incluyendo las validaciones de negocio específicas de la historia de usuario (selección de paciente y al menos un medicamento). Simula la generación de un PDF.

4.  **Capa de Datos (Types)**:
    *   Se definen interfaces claras (`Patient`, `Medication`, `MedicationPrescription`, `PrescriptionData`) para asegurar la coherencia de los datos en toda la aplicación.

5.  **Navegación**: Se utiliza `React Navigation` para estructurar las pantallas de la aplicación.

Este diseño permite que cada parte tenga una única responsabilidad, facilitando el mantenimiento, la prueba y la escalabilidad del código.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens)**:
    *   `PrescriptionGeneratorScreen`: Vista principal para generar una receta electrónica. Contiene el formulario, maneja la carga de datos iniciales y la acción final de generación.
*   **Componentes Reutilizables (Components)**:
    *   `StyledInput`: `TextInput` estilizado genérico.
    *   `Button`: Componente de botón genérico.
    *   `DropdownPicker`: Componente para seleccionar un elemento de una lista (pacientes, medicamentos).
    *   `MedicationItemForm`: Formulario específico para un medicamento individual dentro de la receta (selección, dosis, instrucciones).
    *   `PrescriptionForm`: Formulario que engloba la selección del paciente y la lista de `MedicationItemForm`.
*   **Hooks Personalizados (Hooks)**:
    *   `usePrescriptionFormLogic`: Hook para encapsular la lógica de estado y validación del formulario de receta.
*   **Servicios (Services)**:
    *   `PatientService`: Servicio para obtener datos de pacientes.
    *   `MedicationService`: Servicio para obtener datos de medicamentos.
    *   `PrescriptionService`: Servicio para procesar y "generar" la receta.
*   **Tipos (Types)**:
    *   `Patient`, `Medication`, `MedicationPrescription`, `PrescriptionData`.

---

### 2) Estructura de Archivos

```
src/
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   └── PrescriptionGeneratorScreen.tsx
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── StyledInput.tsx
│   │   └── DropdownPicker.tsx
│   ├── PrescriptionForm.tsx
│   └── MedicationItemForm.tsx
├── services/
│   ├── PatientService.ts
│   ├── MedicationService.ts
│   └── PrescriptionService.ts
├── hooks/
│   └── usePrescriptionFormLogic.ts
├── types/
│   └── index.ts
└── App.tsx
```

---

### 3) Código Fuente (TypeScript/TSX)

Empezamos definiendo los tipos de datos que usaremos.

```typescript filename=src/types/index.ts
// src/types/index.ts

/**
 * @interface Patient
 * @description Define la estructura de un objeto paciente.
 */
export interface Patient {
  id: string;
  name: string;
}

/**
 * @interface Medication
 * @description Define la estructura de un objeto medicamento.
 */
export interface Medication {
  id: string;
  name: string;
}

/**
 * @interface MedicationPrescription
 * @description Define los detalles de un medicamento prescrito, incluyendo su ID temporal para manejo en UI.
 */
export interface MedicationPrescription {
  uiId: string; // ID único para la UI, no persistente
  medicationId: string;
  medicationName: string; // Para mostrar en el formulario
  dosage: string;
  instructions: string;
}

/**
 * @interface PrescriptionData
 * @description Define la estructura de los datos necesarios para generar una receta.
 */
export interface PrescriptionData {
  patientId: string;
  medications: Omit<MedicationPrescription, 'uiId' | 'medicationName'>[]; // Excluye uiId y medicationName para el servicio
}
```

Ahora, los servicios que simulan la interacción con datos.

```typescript filename=src/services/PatientService.ts
// src/services/PatientService.ts

import { Patient } from '../types';

/**
 * @class PatientService
 * @description Servicio para manejar las operaciones relacionadas con los pacientes.
 *              En un entorno real, esto interactuaría con una API.
 */
class PatientService {
  private patients: Patient[] = [
    { id: '1', name: 'Juan Pérez' },
    { id: '2', name: 'María García' },
    { id: '3', name: 'Carlos López' },
  ];

  /**
   * @method getPatients
   * @description Simula la obtención de una lista de pacientes.
   * @returns {Promise<Patient[]>} Una promesa que resuelve con la lista de pacientes.
   */
  async getPatients(): Promise<Patient[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.patients);
      }, 500); // Simula un retraso de red
    });
  }
}

export const patientService = new PatientService();
```

```typescript filename=src/services/MedicationService.ts
// src/services/MedicationService.ts

import { Medication } from '../types';

/**
 * @class MedicationService
 * @description Servicio para manejar las operaciones relacionadas con los medicamentos.
 *              En un entorno real, esto interactuaría con una API.
 */
class MedicationService {
  private medications: Medication[] = [
    { id: 'm1', name: 'Paracetamol 500mg' },
    { id: 'm2', name: 'Ibuprofeno 400mg' },
    { id: 'm3', name: 'Amoxicilina 250mg' },
    { id: 'm4', name: 'Omeprazol 20mg' },
  ];

  /**
   * @method getMedications
   * @description Simula la obtención de una lista de medicamentos.
   * @returns {Promise<Medication[]>} Una promesa que resuelve con la lista de medicamentos.
   */
  async getMedications(): Promise<Medication[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(this.medications);
      }, 500); // Simula un retraso de red
    });
  }
}

export const medicationService = new MedicationService();
```

El servicio clave para la historia de usuario.

```typescript filename=src/services/PrescriptionService.ts
// src/services/PrescriptionService.ts

import { PrescriptionData } from '../types';
import { Alert } from 'react-native';

/**
 * @class PrescriptionService
 * @description Servicio para manejar la generación de recetas electrónicas.
 *              Incluye la lógica de validación de los escenarios Gherkin.
 */
class PrescriptionService {
  /**
   * @method generatePrescription
   * @description Simula la generación de una receta electrónica en formato PDF.
   *              Implementa los escenarios Gherkin para validación.
   * @param {PrescriptionData} prescriptionData - Los datos de la receta a generar.
   * @returns {Promise<string>} Una promesa que resuelve con un mensaje de éxito o rechaza con un mensaje de error.
   */
  async generatePrescription(prescriptionData: PrescriptionData): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Escenario Gherkin: Falta de datos (no se selecciona ningún medicamento)
        if (!prescriptionData.medications || prescriptionData.medications.length === 0) {
          Alert.alert('Error de validación', 'Debe seleccionar al menos un medicamento.');
          return reject('Debe seleccionar al menos un medicamento.');
        }

        // Validación adicional (aunque no explícita en Gherkin, es buena práctica)
        if (!prescriptionData.patientId) {
            Alert.alert('Error de validación', 'Debe seleccionar un paciente.');
            return reject('Debe seleccionar un paciente.');
        }

        // Verificar que todos los medicamentos tienen dosis e instrucciones
        const invalidMedication = prescriptionData.medications.find(med => !med.dosage || !med.instructions);
        if (invalidMedication) {
            Alert.alert('Error de validación', 'Todos los medicamentos deben tener dosis e instrucciones.');
            return reject('Todos los medicamentos deben tener dosis e instrucciones.');
        }

        // Escenario Gherkin: Receta generada correctamente
        const pdfContent = `
          RECETA ELECTRÓNICA
          -------------------
          Paciente ID: ${prescriptionData.patientId}
          Fecha: ${new Date().toLocaleDateString()}
          -------------------
          Medicamentos:
          ${prescriptionData.medications.map(med =>
            `- ID Medicamento: ${med.medicationId}
              Dosis: ${med.dosage}
              Instrucciones: ${med.instructions}`
          ).join('\n          ')}
          -------------------
          (Este es un PDF simulado)
        `;
        console.log('--- Contenido del PDF de la Receta Generada ---');
        console.log(pdfContent);
        console.log('-----------------------------------------------');
        Alert.alert('Éxito', 'Receta generada correctamente (simulando PDF).');
        resolve('Receta generada con éxito.');
      }, 1000); // Simula el tiempo de procesamiento de la generación de PDF
    });
  }
}

export const prescriptionService = new PrescriptionService();
```

Componentes UI genéricos.

```typescript filename=src/components/common/StyledInput.tsx
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
```

```typescript filename=src/components/common/Button.tsx
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
```

```typescript filename=src/components/common/DropdownPicker.tsx
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
```

Ahora, los componentes específicos de la receta.

```typescript filename=src/components/MedicationItemForm.tsx
// src/components/MedicationItemForm.tsx

import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import StyledInput from './common/StyledInput';
import Button from './common/Button';
import DropdownPicker from './common/DropdownPicker';
import { Medication, MedicationPrescription } from '../types';

/**
 * @interface MedicationItemFormProps
 * @description Props para el componente MedicationItemForm.
 */
interface MedicationItemFormProps {
  medicationPrescription: MedicationPrescription;
  allMedications: Medication[];
  onUpdate: (uiId: string, field: keyof MedicationPrescription, value: string) => void;
  onRemove: (uiId: string) => void;
  error?: { dosage?: string; instructions?: string; medicationId?: string }; // Para mostrar errores de validación
}

/**
 * @function MedicationItemForm
 * @description Componente para introducir y editar los detalles de un medicamento prescrito.
 * @param {MedicationItemFormProps} props - Propiedades para el formulario de medicamento.
 * @returns {JSX.Element} Un componente de formulario para un solo medicamento.
 */
const MedicationItemForm: React.FC<MedicationItemFormProps> = ({
  medicationPrescription,
  allMedications,
  onUpdate,
  onRemove,
  error,
}) => {
  const { uiId, medicationId, dosage, instructions } = medicationPrescription;

  const handleMedicationChange = (value: string) => {
    const selectedMed = allMedications.find(m => m.id === value);
    onUpdate(uiId, 'medicationId', value);
    onUpdate(uiId, 'medicationName', selectedMed ? selectedMed.name : '');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{medicationPrescription.medicationName || 'Nuevo Medicamento'}</Text>
        <Button
          title="Eliminar"
          onPress={() => onRemove(uiId)}
          variant="danger"
          style={styles.removeButton}
          textStyle={styles.removeButtonText}
        />
      </View>

      <DropdownPicker
        label="Medicamento"
        selectedValue={medicationId}
        onValueChange={handleMedicationChange}
        items={allMedications}
        placeholder="Seleccione un medicamento"
      />
      {error?.medicationId && <Text style={styles.errorText}>{error.medicationId}</Text>}

      <StyledInput
        label="Dosis"
        placeholder="Ej: 500mg cada 8 horas"
        value={dosage}
        onChangeText={(text) => onUpdate(uiId, 'dosage', text)}
      />
      {error?.dosage && <Text style={styles.errorText}>{error.dosage}</Text>}

      <StyledInput
        label="Instrucciones"
        placeholder="Ej: Tomar con alimentos"
        value={instructions}
        onChangeText={(text) => onUpdate(uiId, 'instructions', text)}
        multiline
        numberOfLines={3}
        style={styles.instructionsInput}
      />
      {error?.instructions && <Text style={styles.errorText}>{error.instructions}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f8f8f8',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#eee',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    flexShrink: 1, // Permite que el texto se encoja si el botón es grande
    marginRight: 10,
  },
  removeButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    backgroundColor: '#dc3545',
  },
  removeButtonText: {
    fontSize: 14,
  },
  instructionsInput: {
    height: 80, // Mayor altura para instrucciones multilínea
    textAlignVertical: 'top', // Alinea el texto al inicio en Android
  },
  errorText: {
    color: 'red',
    fontSize: 12,
    marginBottom: 5,
    marginTop: -5,
  },
});

export default MedicationItemForm;
```

El hook personalizado que contiene la lógica de estado del formulario.

```typescript filename=src/hooks/usePrescriptionFormLogic.ts
// src/hooks/usePrescriptionFormLogic.ts

import { useState, useCallback } from 'react';
import { Patient, Medication, MedicationPrescription, PrescriptionData } from '../types';
import uuid from 'react-native-uuid'; // Para generar IDs únicos para los medicamentos en la UI

/**
 * @interface FormErrors
 * @description Define la estructura de errores de validación para el formulario.
 */
interface FormErrors {
  patientId?: string;
  medications?: { [uiId: string]: { medicationId?: string; dosage?: string; instructions?: string } };
  general?: string;
}

/**
 * @function usePrescriptionFormLogic
 * @description Hook personalizado para manejar la lógica de estado y validación
 *              del formulario de generación de recetas.
 * @returns {object} Un objeto con el estado del formulario, las acciones y los errores.
 */
const usePrescriptionFormLogic = () => {
  const [selectedPatientId, setSelectedPatientId] = useState<string>('');
  const [medications, setMedications] = useState<MedicationPrescription[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});

  /**
   * @function addMedication
   * @description Añade un nuevo medicamento vacío a la lista de prescripciones.
   */
  const addMedication = useCallback(() => {
    const newMedication: MedicationPrescription = {
      uiId: uuid.v4().toString(), // Genera un ID único para la UI
      medicationId: '',
      medicationName: '',
      dosage: '',
      instructions: '',
    };
    setMedications((prev) => [...prev, newMedication]);
  }, []);

  /**
   * @function updateMedication
   * @description Actualiza un campo específico de un medicamento en la lista.
   * @param {string} uiId - El ID único del medicamento a actualizar.
   * @param {keyof MedicationPrescription} field - El campo del medicamento a actualizar.
   * @param {string} value - El nuevo valor del campo.
   */
  const updateMedication = useCallback((uiId: string, field: keyof MedicationPrescription, value: string) => {
    setMedications((prev) =>
      prev.map((med) => (med.uiId === uiId ? { ...med, [field]: value } : med))
    );
    // Limpia el error para este campo si existe
    if (errors.medications?.[uiId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        medications: {
          ...prev.medications,
          [uiId]: {
            ...prev.medications?.[uiId],
            [field]: undefined,
          }
        }
      }));
    }
  }, [errors.medications]);

  /**
   * @function removeMedication
   * @description Elimina un medicamento de la lista de prescripciones.
   * @param {string} uiId - El ID único del medicamento a eliminar.
   */
  const removeMedication = useCallback((uiId: string) => {
    setMedications((prev) => prev.filter((med) => med.uiId !== uiId));
    // También elimina errores asociados si existen
    if (errors.medications?.[uiId]) {
        setErrors(prev => {
            const newMedsErrors = { ...prev.medications };
            delete newMedsErrors[uiId];
            return { ...prev, medications: newMedsErrors };
        });
    }
  }, [errors.medications]);

  /**
   * @function validateForm
   * @description Valida todos los campos del formulario de receta.
   * @returns {boolean} `true` si el formulario es válido, `false` en caso contrario.
   */
  const validateForm = useCallback(() => {
    const newErrors: FormErrors = {};
    let isValid = true;

    if (!selectedPatientId) {
      newErrors.patientId = 'Debe seleccionar un paciente.';
      isValid = false;
    }

    if (medications.length === 0) {
      newErrors.general = 'Debe añadir al menos un medicamento.';
      isValid = false;
    } else {
      newErrors.medications = {};
      medications.forEach(med => {
        let medIsValid = true;
        const medErrors: { medicationId?: string; dosage?: string; instructions?: string } = {};

        if (!med.medicationId) {
          medErrors.medicationId = 'Seleccione un medicamento.';
          medIsValid = false;
        }
        if (!med.dosage.trim()) {
          medErrors.dosage = 'La dosis es obligatoria.';
          medIsValid = false;
        }
        if (!med.instructions.trim()) {
          medErrors.instructions = 'Las instrucciones son obligatorias.';
          medIsValid = false;
        }

        if (!medIsValid) {
          newErrors.medications![med.uiId] = medErrors;
          isValid = false;
        }
      });
    }

    setErrors(newErrors);
    return isValid;
  }, [selectedPatientId, medications]);

  /**
   * @function getPrescriptionData
   * @description Prepara los datos del formulario para ser enviados al servicio.
   * @returns {PrescriptionData} Los datos de la receta listos para el servicio.
   */
  const getPrescriptionData = useCallback((): PrescriptionData => {
    return {
      patientId: selectedPatientId,
      medications: medications.map(med => ({
        medicationId: med.medicationId,
        dosage: med.dosage,
        instructions: med.instructions,
      })),
    };
  }, [selectedPatientId, medications]);

  /**
   * @function resetForm
   * @description Reinicia el estado del formulario a sus valores iniciales.
   */
  const resetForm = useCallback(() => {
    setSelectedPatientId('');
    setMedications([]);
    setErrors({});
  }, []);

  return {
    // Estado
    selectedPatientId,
    medications,
    errors,
    // Acciones
    setSelectedPatientId,
    addMedication,
    updateMedication,
    removeMedication,
    validateForm,
    getPrescriptionData,
    resetForm,
  };
};

export default usePrescriptionFormLogic;
```

El componente `PrescriptionForm` que utiliza el hook y los componentes UI.

```typescript filename=src/components/PrescriptionForm.tsx
// src/components/PrescriptionForm.tsx

import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Button from './common/Button';
import DropdownPicker from './common/DropdownPicker';
import MedicationItemForm from './MedicationItemForm';
import { Patient, Medication, MedicationPrescription } from '../types';
import { FormErrors } from '../hooks/usePrescriptionFormLogic'; // Importa FormErrors

/**
 * @interface PrescriptionFormProps
 * @description Props para el componente PrescriptionForm.
 */
interface PrescriptionFormProps {
  patients: Patient[];
  allMedications: Medication[];
  selectedPatientId: string;
  medications: MedicationPrescription[];
  errors: FormErrors;
  onPatientChange: (patientId: string) => void;
  onAddMedication: () => void;
  onUpdateMedication: (uiId: string, field: keyof MedicationPrescription, value: string) => void;
  onRemoveMedication: (uiId: string) => void;
  // Puedes añadir onSubmit, loading, etc. si el botón de submit está aquí
}

/**
 * @function PrescriptionForm
 * @description Componente de formulario para la generación de recetas.
 *              Encapsula la selección de paciente y la lista de medicamentos.
 * @param {PrescriptionFormProps} props - Propiedades para el formulario de receta.
 * @returns {JSX.Element} Un componente de formulario de receta.
 */
const PrescriptionForm: React.FC<PrescriptionFormProps> = ({
  patients,
  allMedications,
  selectedPatientId,
  medications,
  errors,
  onPatientChange,
  onAddMedication,
  onUpdateMedication,
  onRemoveMedication,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.sectionTitle}>Datos del Paciente</Text>
      <DropdownPicker
        label="Seleccionar Paciente"
        selectedValue={selectedPatientId}
        onValueChange={onPatientChange}
        items={patients}
        placeholder="Seleccione un paciente"
      />
      {errors.patientId && <Text style={styles.errorText}>{errors.patientId}</Text>}

      <Text style={styles.sectionTitle}>Medicamentos</Text>
      {medications.map((med) => (
        <MedicationItemForm
          key={med.uiId}
          medicationPrescription={med}
          allMedications={allMedications}
          onUpdate={onUpdateMedication}
          onRemove={onRemoveMedication}
          error={errors.medications?.[med.uiId]}
        />
      ))}

      <Button title="Añadir Medicamento" onPress={onAddMedication} style={styles.addButton} />
      {errors.general && <Text style={styles.errorText}>{errors.general}</Text>}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  contentContainer: {
    paddingBottom: 20, // Asegura espacio al final del scroll
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
    marginTop: 10,
  },
  addButton: {
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#28a745',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
    textAlign: 'center',
  },
});

export default PrescriptionForm;
```

Finalmente, la pantalla principal `PrescriptionGeneratorScreen`.

```typescript filename=src/screens/PrescriptionGeneratorScreen.tsx
// src/screens/PrescriptionGeneratorScreen.tsx

import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ActivityIndicator, Alert, SafeAreaView } from 'react-native';
import PrescriptionForm from '../components/PrescriptionForm';
import Button from '../components/common/Button';
import { patientService } from '../services/PatientService';
import { medicationService } from '../services/MedicationService';
import { prescriptionService } from '../services/PrescriptionService';
import { Patient, Medication } from '../types';
import usePrescriptionFormLogic from '../hooks/usePrescriptionFormLogic';
import { StackScreenProps } from '@react-navigation/stack'; // Si usas Stack Navigator

// Define los tipos de parámetros para la navegación (ejemplo)
type RootStackParamList = {
  PrescriptionGenerator: undefined;
  // Puedes añadir otras pantallas aquí
};

// Define las props para esta pantalla
type PrescriptionGeneratorScreenProps = StackScreenProps<RootStackParamList, 'PrescriptionGenerator'>;

/**
 * @function PrescriptionGeneratorScreen
 * @description Pantalla principal para generar recetas electrónicas.
 *              Orquesta la carga de datos, la gestión del formulario y la interacción con los servicios.
 * @param {PrescriptionGeneratorScreenProps} props - Propiedades de navegación.
 * @returns {JSX.Element} La pantalla de generación de recetas.
 */
const PrescriptionGeneratorScreen: React.FC<PrescriptionGeneratorScreenProps> = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [allMedications, setAllMedications] = useState<Medication[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Hook personalizado para la lógica del formulario
  const {
    selectedPatientId,
    medications,
    errors,
    setSelectedPatientId,
    addMedication,
    updateMedication,
    removeMedication,
    validateForm,
    getPrescriptionData,
    resetForm,
  } = usePrescriptionFormLogic();

  // Cargar datos iniciales (pacientes y medicamentos) al montar el componente
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [patientsData, medicationsData] = await Promise.all([
          patientService.getPatients(),
          medicationService.getMedications(),
        ]);
        setPatients(patientsData);
        setAllMedications(medicationsData);
      } catch (error) {
        console.error('Error al cargar datos iniciales:', error);
        Alert.alert('Error', 'No se pudieron cargar los datos de pacientes o medicamentos.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  /**
   * @function handleSubmit
   * @description Maneja el envío del formulario para generar la receta.
   *              Realiza la validación y llama al servicio de recetas.
   */
  const handleSubmit = async () => {
    if (!validateForm()) {
      Alert.alert('Error de validación', 'Por favor, corrija los errores en el formulario.');
      return;
    }

    setSubmitting(true);
    try {
      const prescriptionData = getPrescriptionData();
      await prescriptionService.generatePrescription(prescriptionData);
      resetForm(); // Limpiar el formulario después de una generación exitosa
    } catch (error: any) {
      // El PrescriptionService ya muestra alertas de errores específicos (Gherkin)
      // Aquí puedes manejar errores genéricos o loguearlos
      console.error('Error al generar la receta:', error);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <PrescriptionForm
        patients={patients}
        allMedications={allMedications}
        selectedPatientId={selectedPatientId}
        medications={medications}
        errors={errors}
        onPatientChange={setSelectedPatientId}
        onAddMedication={addMedication}
        onUpdateMedication={updateMedication}
        onRemoveMedication={removeMedication}
      />
      <View style={styles.buttonContainer}>
        <Button
          title="Generar Receta"
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting || loading}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f0f2f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  buttonContainer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
});

export default PrescriptionGeneratorScreen;
```

Finalmente, la configuración básica de React Navigation.

```typescript filename=src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PrescriptionGeneratorScreen from '../screens/PrescriptionGeneratorScreen';

// Definimos los tipos de parámetros para las rutas de nuestro Stack Navigator
type RootStackParamList = {
  PrescriptionGenerator: undefined; // La pantalla no recibe parámetros
  // Puedes añadir otras rutas aquí
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * @function AppNavigator
 * @description Componente principal de navegación de la aplicación.
 *              Configura el Stack Navigator para las pantallas principales.
 * @returns {JSX.Element} Un contenedor de navegación con el Stack Navigator.
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PrescriptionGenerator">
        <Stack.Screen
          name="PrescriptionGenerator"
          component={PrescriptionGeneratorScreen}
          options={{ title: 'Generar Receta Electrónica' }}
        />
        {/* Aquí puedes añadir más pantallas a tu stack */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

Y el `App.tsx` para iniciar la aplicación.

```typescript filename=App.tsx
// App.tsx

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * @function App
 * @description Componente raíz de la aplicación React Native.
 *              Renderiza el navegador principal de la aplicación.
 * @returns {JSX.Element} El componente AppNavigator.
 */
const App: React.FC = () => {
  return <AppNavigator />;
};

export default App;
```

### Para ejecutar este código:

1.  Asegúrate de tener un proyecto React Native configurado.
2.  Instala las dependencias necesarias:
    ```bash
    npm install @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context @react-native-picker/picker react-native-uuid
    # o
    yarn add @react-navigation/native @react-navigation/stack react-native-screens react-native-safe-area-context @react-native-picker/picker react-native-uuid
    ```
3.  Para `react-native-screens`, sigue las instrucciones de configuración para iOS y Android (generalmente `npx pod-install` en `ios/`).
4.  Copia los archivos a sus respectivas rutas dentro de `src/`.
5.  Ejecuta `npm run ios` o `npm run android`.

Esta arquitectura proporciona una base sólida, siguiendo las mejores prácticas y abordando los requisitos específicos de la historia de usuario 6 con una clara separación de la lógica, el estado y la presentación.