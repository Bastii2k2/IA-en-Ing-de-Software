Aquí tienes el diseño de arquitectura y el código para la **Historia de Usuario 3: Búsqueda y Filtrado de Pacientes**.

---

### Resumen de la Arquitectura

La arquitectura propuesta para la búsqueda y filtrado de pacientes sigue un enfoque modular y basado en el patrón "Service-Hook-Component-Screen".

1.  **Capas de Presentación (Screens y Components)**:
    *   `PatientSearchScreen`: La pantalla principal que orquesta la UI de búsqueda. Utiliza hooks personalizados para la lógica y componentes reutilizables para la interfaz.
    *   `PatientListItem`: Un componente reutilizable para mostrar la información básica de un paciente en la lista de resultados.
    *   `StyledInput`, `Button`, `EmptyStateMessage`, `SearchResultList`: Componentes genéricos y reutilizables para elementos UI básicos y patrones comunes de lista/estado vacío.
2.  **Capa de Lógica (Hooks Personalizados)**:
    *   `usePatientSearch`: Un hook personalizado que encapsula toda la lógica de estado y interacción con el servicio para la búsqueda de pacientes, manteniendo la pantalla limpia y enfocada en la presentación.
3.  **Capa de Datos/Servicios (Services)**:
    *   `PatientService`: Un servicio dedicado a la gestión de datos de pacientes. Contiene el método `searchPatients` que simula una llamada a una API y realiza el filtrado de pacientes. Utiliza `AsyncStorage` para simular la persistencia y tener datos de prueba.
4.  **Tipos y Utilidades**:
    *   `src/types/index.ts`: Define las interfaces de datos (ej. `Patient`) para garantizar la consistencia y seguridad de tipo en toda la aplicación.
    *   `src/navigation/AppNavigator.tsx`: Un componente para configurar la navegación de la aplicación usando React Navigation, incluyendo la nueva `PatientSearchScreen`.

Este diseño promueve la separación de responsabilidades, la reutilización de componentes y la facilidad de mantenimiento, evitando "God Components" al delegar la lógica de negocio a servicios y la lógica de UI a hooks personalizados.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens)**:
    *   `PatientSearchScreen`: Pantalla principal para que el usuario ingrese criterios de búsqueda, ejecute la búsqueda y vea los resultados.
*   **Componentes Reutilizables (Components)**:
    *   `StyledInput`: Un campo de entrada de texto estilizado y genérico.
    *   `Button`: Un botón estilizado y genérico.
    *   `PatientListItem`: Muestra la información básica de un paciente individual en la lista de resultados de búsqueda.
    *   `SearchResultList`: Un contenedor para renderizar una lista de `PatientListItem`s.
    *   `EmptyStateMessage`: Muestra un mensaje cuando no hay resultados o la lista está vacía.
*   **Hooks Personalizados (Hooks)**:
    *   `usePatientSearch`: Hook para manejar la lógica de estado (término de búsqueda, resultados, carga, errores) y la interacción con `PatientService` para la búsqueda.
*   **Servicios (Services)**:
    *   `PatientService`: Responsable de interactuar con la fuente de datos de pacientes (simulado con `AsyncStorage` en este caso), incluyendo la lógica para `searchPatients`.

### 2) Estructura de Archivos

```
src/
├── components/
│   ├── common/
│   │   ├── Button.tsx
│   │   ├── EmptyStateMessage.tsx
│   │   ├── SearchResultList.tsx
│   │   └── StyledInput.tsx
│   └── patients/
│       └── PatientListItem.tsx
├── hooks/
│   └── usePatientSearch.ts
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   └── PatientSearchScreen.tsx
├── services/
│   └── PatientService.ts
└── types/
    └── index.ts
```

---

### 3) Código Fuente (TypeScript/TSX)

Primero, los tipos compartidos:

```typescript filename=src/types/index.ts
// src/types/index.ts

/**
 * @interface Patient
 * Define la estructura de datos para un paciente.
 * Contiene información básica necesaria para la gestión y búsqueda.
 */
export interface Patient {
  id: string; // Identificador único del paciente
  name: string; // Nombre del paciente
  surname: string; // Apellido del paciente
  dob: string; // Fecha de nacimiento (ej. 'YYYY-MM-DD')
  medicalHistory: string; // Breve historial médico o notas relevantes
}
```

Ahora, el servicio que simula la persistencia y la lógica de búsqueda:

```typescript filename=src/services/PatientService.ts
// src/services/PatientService.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Patient } from '../types';

// Clave para almacenar los pacientes en AsyncStorage
const PATIENTS_STORAGE_KEY = '@MediCS:patients';

// Datos de pacientes simulados para inicializar AsyncStorage
const MOCK_PATIENTS: Patient[] = [
  { id: '1', name: 'Juan', surname: 'Pérez', dob: '1985-05-10', medicalHistory: 'Hipertensión' },
  { id: '2', name: 'María', surname: 'García', dob: '1990-11-22', medicalHistory: 'Asma' },
  { id: '3', name: 'Pedro', surname: 'Rodríguez', dob: '1978-01-15', medicalHistory: 'Diabetes' },
  { id: '4', name: 'Ana', surname: 'Martínez', dob: '1992-07-03', medicalHistory: 'Alergia a la penicilina' },
  { id: '5', name: 'Sofía', surname: 'Pérez', dob: '2000-03-20', medicalHistory: 'Ninguna' },
  { id: '6', name: 'Carlos', surname: 'López', dob: '1975-02-28', medicalHistory: 'Artrosis' },
  { id: '7', name: 'Laura', surname: 'García', dob: '1988-09-17', medicalHistory: 'Migrañas' },
  { id: '8', name: 'Miguel', surname: 'Fernández', dob: '1965-04-01', medicalHistory: 'Colesterol alto' },
];

/**
 * @class PatientService
 * Provee métodos para la gestión de datos de pacientes,
 * simulando la interacción con una API o base de datos local.
 * Utiliza AsyncStorage para la persistencia.
 */
class PatientService {
  private async getPatientsFromStorage(): Promise<Patient[]> {
    try {
      const storedPatients = await AsyncStorage.getItem(PATIENTS_STORAGE_KEY);
      if (storedPatients) {
        return JSON.parse(storedPatients) as Patient[];
      }
    } catch (error) {
      console.error('Error al obtener pacientes de AsyncStorage:', error);
    }
    return [];
  }

  private async savePatientsToStorage(patients: Patient[]): Promise<void> {
    try {
      await AsyncStorage.setItem(PATIENTS_STORAGE_KEY, JSON.stringify(patients));
    } catch (error) {
      console.error('Error al guardar pacientes en AsyncStorage:', error);
    }
  }

  /**
   * Inicializa los pacientes en AsyncStorage si no existen.
   * Esto asegura que siempre tengamos datos de prueba al iniciar la app.
   */
  public async initPatients(): Promise<void> {
    const patients = await this.getPatientsFromStorage();
    if (patients.length === 0) { // Si no hay pacientes, los inicializamos con los mock
      await this.savePatientsToStorage(MOCK_PATIENTS);
      console.log('Pacientes inicializados en AsyncStorage.');
    }
  }

  /**
   * Busca pacientes que coincidan con un criterio dado (nombre o apellido).
   * @param criteria El término de búsqueda (nombre o apellido).
   * @returns Una promesa que resuelve con un array de pacientes que coinciden.
   */
  public async searchPatients(criteria: string): Promise<Patient[]> {
    console.log(`Buscando pacientes con el criterio: "${criteria}"`);
    // Simular un retardo de red
    await new Promise(resolve => setTimeout(resolve, 800));

    const allPatients = await this.getPatientsFromStorage();

    if (!criteria || criteria.trim() === '') {
      // Si el criterio está vacío, no retorna ningún resultado o todos los pacientes,
      // dependiendo de la UX deseada. Aquí, se opta por no retornar nada.
      return [];
    }

    const lowerCaseCriteria = criteria.toLowerCase();

    // Filtra los pacientes cuyo nombre o apellido incluye el criterio de búsqueda.
    const filteredPatients = allPatients.filter(patient =>
      patient.name.toLowerCase().includes(lowerCaseCriteria) ||
      patient.surname.toLowerCase().includes(lowerCaseCriteria)
    );

    return filteredPatients;
  }
}

export const patientService = new PatientService();
```

El hook personalizado para la lógica de búsqueda:

```typescript filename=src/hooks/usePatientSearch.ts
// src/hooks/usePatientSearch.ts

import { useState, useEffect, useCallback } from 'react';
import { Patient } from '../types';
import { patientService } from '../services/PatientService';

/**
 * @interface UsePatientSearch
 * Define la interfaz para el valor retornado por el hook usePatientSearch.
 */
interface UsePatientSearch {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Patient[];
  isLoading: boolean;
  error: string | null;
  handleSearch: () => Promise<void>;
  clearSearch: () => void; // Para limpiar resultados y término
}

/**
 * @function usePatientSearch
 * Hook personalizado para manejar la lógica de búsqueda de pacientes.
 * Encapsula el estado del término de búsqueda, los resultados, el estado de carga y errores.
 *
 * @returns {UsePatientSearch} Un objeto con el estado y las funciones para la búsqueda de pacientes.
 */
export const usePatientSearch = (): UsePatientSearch => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializa los pacientes en el servicio al montar el hook
  useEffect(() => {
    patientService.initPatients().catch(err => {
      console.error("Error initializing patients:", err);
      setError("No se pudieron cargar los datos iniciales de pacientes.");
    });
  }, []);

  /**
   * Ejecuta la búsqueda de pacientes utilizando el PatientService.
   * Actualiza los estados de carga, resultados y errores.
   */
  const handleSearch = useCallback(async () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]); // Limpiar resultados si el término de búsqueda está vacío
      return;
    }

    setIsLoading(true);
    setError(null); // Limpiar errores previos
    try {
      const results = await patientService.searchPatients(searchTerm);
      setSearchResults(results);
    } catch (e) {
      console.error('Error al buscar pacientes:', e);
      setError('Ocurrió un error al buscar pacientes. Inténtalo de nuevo.');
      setSearchResults([]); // Limpiar resultados en caso de error
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  /**
   * Limpia el término de búsqueda y los resultados.
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    error,
    handleSearch,
    clearSearch,
  };
};
```

Los componentes de UI comunes:

```typescript filename=src/components/common/StyledInput.tsx
// src/components/common/StyledInput.tsx

import React from 'react';
import { TextInput, TextInputProps, StyleSheet, View, Text } from 'react-native';

/**
 * @interface StyledInputProps
 * Propiedades para el componente StyledInput.
 * Extiende las props nativas de TextInput y añade una prop opcional para el label.
 */
interface StyledInputProps extends TextInputProps {
  label?: string; // Etiqueta opcional para el campo de entrada
}

/**
 * @function StyledInput
 * Un componente de entrada de texto estilizado y reutilizable.
 * Permite añadir una etiqueta encima del campo.
 *
 * @param {StyledInputProps} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente TextInput con estilos predefinidos.
 */
const StyledInput: React.FC<StyledInputProps> = ({ label, style, ...rest }) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <TextInput
        style={[styles.input, style]}
        placeholderTextColor="#666" // Color de placeholder por defecto
        {...rest}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 15, // Espacio inferior para separación
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
    fontWeight: 'bold',
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    fontSize: 16,
    backgroundColor: '#fff',
    color: '#333', // Color del texto de entrada
  },
});

export default StyledInput;
```

```typescript filename=src/components/common/Button.tsx
// src/components/common/Button.tsx

import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, ViewStyle, TextStyle } from 'react-native';

/**
 * @interface ButtonProps
 * Propiedades para el componente Button.
 */
interface ButtonProps {
  title: string; // Texto a mostrar en el botón
  onPress: () => void; // Función a ejecutar al presionar el botón
  isLoading?: boolean; // Si es true, muestra un indicador de carga y deshabilita el botón
  style?: ViewStyle; // Estilos adicionales para el contenedor del botón
  textStyle?: TextStyle; // Estilos adicionales para el texto del botón
  disabled?: boolean; // Para deshabilitar el botón
}

/**
 * @function Button
 * Un componente de botón estilizado y reutilizable.
 * Incluye un indicador de carga opcional.
 *
 * @param {ButtonProps} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente de botón táctil.
 */
const Button: React.FC<ButtonProps> = ({ title, onPress, isLoading = false, style, textStyle, disabled = false }) => {
  return (
    <TouchableOpacity
      style={[styles.button, style, (isLoading || disabled) && styles.disabledButton]}
      onPress={onPress}
      disabled={isLoading || disabled} // Deshabilita el botón si está cargando o explícitamente deshabilitado
      activeOpacity={0.7} // Opacidad al presionar
    >
      {isLoading ? (
        <ActivityIndicator color="#fff" /> // Muestra un spinner si está cargando
      ) : (
        <Text style={[styles.buttonText, textStyle]}>{title}</Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#007bff', // Color de fondo primario
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 45, // Altura mínima para asegurar espacio para el spinner
  },
  buttonText: {
    color: '#fff', // Color del texto
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0c7ff', // Color más claro para botones deshabilitados
  },
});

export default Button;
```

```typescript filename=src/components/common/SearchResultList.tsx
// src/components/common/SearchResultList.tsx

import React from 'react';
import { FlatList, View, StyleSheet, ListRenderItemInfo } from 'react-native';

/**
 * @interface SearchResultListProps
 * Propiedades para el componente SearchResultList.
 * @template T El tipo de dato para cada elemento en la lista.
 */
interface SearchResultListProps<T> {
  data: T[]; // Array de datos a renderizar
  renderItem: ({ item, index }: ListRenderItemInfo<T>) => React.ReactElement; // Función para renderizar cada item
  keyExtractor: (item: T, index: number) => string; // Función para extraer una clave única por item
  emptyMessageComponent?: React.ReactElement; // Componente a mostrar cuando la lista está vacía
}

/**
 * @function SearchResultList
 * Un componente genérico para renderizar listas de resultados.
 * Envuelve un FlatList y permite mostrar un componente personalizado
 * cuando la lista de datos está vacía.
 *
 * @template T Tipo de los elementos de la lista.
 * @param {SearchResultListProps<T>} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente FlatList o el mensaje de lista vacía.
 */
function SearchResultList<T>({ data, renderItem, keyExtractor, emptyMessageComponent }: SearchResultListProps<T>): React.ReactElement {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={emptyMessageComponent} // Muestra este componente si 'data' está vacío
        contentContainerStyle={data.length === 0 && styles.emptyListContainer} // Estilos para el contenedor cuando la lista está vacía
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permite que la lista ocupe el espacio disponible
    width: '100%',
  },
  emptyListContainer: {
    flexGrow: 1, // Permite que el contenido vacío ocupe todo el espacio vertical
    justifyContent: 'center', // Centra el mensaje de lista vacía
    alignItems: 'center',
  },
});

export default SearchResultList;
```

```typescript filename=src/components/common/EmptyStateMessage.tsx
// src/components/common/EmptyStateMessage.tsx

import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

/**
 * @interface EmptyStateMessageProps
 * Propiedades para el componente EmptyStateMessage.
 */
interface EmptyStateMessageProps {
  message: string; // El mensaje a mostrar
}

/**
 * @function EmptyStateMessage
 * Un componente genérico para mostrar un mensaje cuando un estado está vacío
 * o no hay resultados.
 *
 * @param {EmptyStateMessageProps} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente View con un texto centrado.
 */
const EmptyStateMessage: React.FC<EmptyStateMessageProps> = ({ message }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.messageText}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1, // Ocupa todo el espacio disponible
    justifyContent: 'center', // Centra verticalmente
    alignItems: 'center', // Centra horizontalmente
    padding: 20,
  },
  messageText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
  },
});

export default EmptyStateMessage;
```

El componente específico de pacientes:

```typescript filename=src/components/patients/PatientListItem.tsx
// src/components/patients/PatientListItem.tsx

import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Patient } from '../../types';

/**
 * @interface PatientListItemProps
 * Propiedades para el componente PatientListItem.
 */
interface PatientListItemProps {
  patient: Patient; // El objeto paciente a mostrar
  onPress?: (patient: Patient) => void; // Función opcional para manejar el click en el item
}

/**
 * @function PatientListItem
 * Un componente que muestra la información básica de un paciente en una lista.
 * Es interactivo (TouchableOpacity) para futuras expansiones (ej. ver detalles).
 *
 * @param {PatientListItemProps} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente visual para un paciente individual.
 */
const PatientListItem: React.FC<PatientListItemProps> = ({ patient, onPress }) => {
  return (
    <TouchableOpacity
      style={styles.container}
      onPress={() => onPress && onPress(patient)} // Ejecuta onPress si está definido
      activeOpacity={onPress ? 0.7 : 1} // Solo activa la opacidad si hay un manejador de clic
    >
      <Text style={styles.name}>{patient.name} {patient.surname}</Text>
      <Text style={styles.detail}>Fecha Nac.: {patient.dob}</Text>
      <Text style={styles.detail}>Historial: {patient.medicalHistory.substring(0, 50)}{patient.medicalHistory.length > 50 ? '...' : ''}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    marginHorizontal: 16,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  detail: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
});

export default PatientListItem;
```

Finalmente, la pantalla principal de búsqueda:

```typescript filename=src/screens/PatientSearchScreen.tsx
// src/screens/PatientSearchScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Keyboard } from 'react-native';
import { usePatientSearch } from '../hooks/usePatientSearch';
import StyledInput from '../components/common/StyledInput';
import Button from '../components/common/Button';
import SearchResultList from '../components/common/SearchResultList';
import EmptyStateMessage from '../components/common/EmptyStateMessage';
import PatientListItem from '../components/patients/PatientListItem';
import { Patient } from '../types';

/**
 * @function PatientSearchScreen
 * Pantalla principal para buscar y filtrar pacientes.
 * Utiliza el hook `usePatientSearch` para la lógica y componentes UI reutilizables.
 */
const PatientSearchScreen: React.FC = () => {
  // Obtenemos los estados y funciones de nuestro hook personalizado
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    error,
    handleSearch,
    clearSearch,
  } = usePatientSearch();

  /**
   * Manejador para el botón de búsqueda.
   * Cierra el teclado antes de iniciar la búsqueda.
   */
  const onSearchPress = () => {
    Keyboard.dismiss(); // Ocultar el teclado al presionar buscar
    handleSearch();
  };

  /**
   * Función para renderizar un item individual de paciente en la lista.
   * @param {Object} item El objeto paciente.
   * @returns {JSX.Element} Un componente PatientListItem.
   */
  const renderPatientItem = ({ item }: { item: Patient }) => (
    <PatientListItem
      patient={item}
      // onPress={() => console.log('Paciente seleccionado:', item.name)}
      // Podríamos navegar a una pantalla de detalles del paciente aquí
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <StyledInput
          label="Buscar paciente"
          placeholder="Nombre o apellido del paciente"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search" // Cambia el botón del teclado a "Buscar"
          onSubmitEditing={onSearchPress} // Ejecuta la búsqueda al presionar "Buscar" en el teclado
          style={styles.searchInput}
        />
        <Button
          title="Buscar"
          onPress={onSearchPress}
          isLoading={isLoading}
          style={styles.searchButton}
          disabled={searchTerm.trim() === ''} // Deshabilita el botón si el término está vacío
        />
      </View>

      {/* Muestra un indicador de carga mientras se buscan resultados */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Buscando pacientes...</Text>
        </View>
      )}

      {/* Muestra mensajes de error si existen */}
      {error && <EmptyStateMessage message={error} />}

      {/* Muestra el mensaje de "No se encontraron resultados" si la búsqueda terminó, no hay resultados y no hay error */}
      {!isLoading && !error && searchTerm.trim() !== '' && searchResults.length === 0 && (
        <EmptyStateMessage message="No se encontraron resultados para su búsqueda." />
      )}

      {/* Muestra la lista de resultados si hay pacientes y no hay errores ni carga */}
      {!isLoading && !error && searchResults.length > 0 && (
        <SearchResultList
          data={searchResults}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1, // Permite que el input ocupe la mayor parte del espacio
    marginRight: 10,
    marginBottom: 0, // Quitamos el margen inferior para alineación en fila
  },
  searchButton: {
    paddingVertical: 12, // Ajustamos el padding para que coincida con la altura del input
    paddingHorizontal: 15,
    minHeight: 45, // Aseguramos la altura mínima
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default PatientSearchScreen;
```

Finalmente, un simple navegador para integrar la pantalla:

```typescript filename=src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PatientSearchScreen from '../screens/PatientSearchScreen';

// Definición de los parámetros para las rutas de navegación
export type RootStackParamList = {
  PatientSearch: undefined; // La pantalla de búsqueda no requiere parámetros iniciales
  // Aquí se añadirían otras pantallas, ej: PatientDetail: { patientId: string };
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * @function AppNavigator
 * Componente principal para la navegación de la aplicación.
 * Utiliza React Navigation para configurar la pila de pantallas.
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="PatientSearch">
        <Stack.Screen
          name="PatientSearch"
          component={PatientSearchScreen}
          options={{ title: 'Buscar Pacientes' }} // Título de la cabecera
        />
        {/* Aquí se añadirían otras pantallas de la aplicación */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```