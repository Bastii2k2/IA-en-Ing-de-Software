## Arquitectura de la Aplicación Móvil - Importación de Imágenes Médicas

### Resumen de la Arquitectura

Esta arquitectura se centra en la implementación de la "Historia de Usuario 4: Importación de Imágenes Médicas (Enabler)", utilizando una estructura modular y siguiendo los principios de separación de responsabilidades. La solución propuesta encapsula la lógica de importación y validación de imágenes en un servicio dedicado (`ImagingService`) y un hook personalizado (`useImagePicker`) para la simulación de la selección de archivos. La interfaz de usuario se presenta mediante un componente modal (`ImageImportModal`) que puede ser invocado desde cualquier pantalla de detalle de paciente, manteniendo los componentes "dumb" y la lógica en hooks o servicios. Se utiliza `React Navigation` para la estructura de navegación básica, aunque el enfoque principal está en la funcionalidad central de importación.

**Principios clave aplicados:**
*   **Separación de Responsabilidades**: Lógica de negocio (validación de imagen) en `ImagingService`, gestión de estado de UI y simulación de selección de archivo en `useImagePicker`, presentación en `ImageImportModal` y `PatientDetailScreen`.
*   **Composición de Componentes**: `ImageImportModal` utiliza `StyledButton` y se integra en `PatientDetailScreen`.
*   **Modularidad**: Servicios, hooks y componentes están definidos en archivos separados, facilitando la reutilización y el mantenimiento.
*   **Testabilidad**: La lógica de negocio en `ImagingService` es fácilmente testeable de forma aislada.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens)**:
    *   `PatientDetailScreen`: (Conceptual) Una pantalla donde se visualizarían los detalles de un paciente. Incluirá un botón para abrir el `ImageImportModal`, simulando el punto de entrada para la funcionalidad de importación.

*   **Componentes Reutilizables (Components)**:
    *   `StyledButton`: Un botón básico estilizado y reutilizable, demostrando la composición de componentes.
    *   `ImageImportModal`: El componente central para la importación de imágenes. Contendrá la UI para seleccionar un archivo (simulado) y activar el proceso de importación. Manejará su propia visibilidad.

*   **Hooks Personalizados (Hooks)**:
    *   `useImagePicker`: Un hook personalizado que simula la selección de un archivo de imagen, manejando su estado y proporcionando una interfaz para "seleccionar" un archivo simulado.

*   **Servicios (Services)**:
    *   `AlertService`: Un servicio simple para mostrar alertas en la aplicación de manera consistente, abstrae `Alert.alert` de React Native.
    *   `ImagingService`: Contiene la lógica para "importar" y validar las imágenes. Simulará la verificación del formato (ej. DICOM) y la interacción con una API (en este caso, mostrando alertas de éxito o error).
    *   `PatientService`: (Mock) Un servicio simple que podría proporcionar datos de paciente, en este caso, un `patientId` simulado.

*   **Tipos (Types)**:
    *   `types/index.ts`: Define interfaces para el archivo de imagen simulado (`SimulatedImageFile`) y los parámetros de navegación de React Navigation.

---

### 2) Estructura de Archivos

```
src/
├── components/
│   ├── ImageImportModal.tsx
│   └── StyledButton.tsx
├── hooks/
│   └── useImagePicker.ts
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   └── PatientDetailScreen.tsx
├── services/
│   ├── AlertService.ts
│   ├── ImagingService.ts
│   └── PatientService.ts
├── types/
│   └── index.ts
├── App.tsx
└── package.json (asume que ya existe)
└── tsconfig.json (asume que ya existe)
```

---

### 3) y 4) Código Fuente con Mejores Prácticas y 5) Comentarios

A continuación, el código fuente para cada archivo, siguiendo las rutas sugeridas y con comentarios explicativos.

```typescript filename=src/types/index.ts
// src/types/index.ts
/**
 * @file Tipos de datos globales para la aplicación.
 */

/**
 * Interfaz para un archivo de imagen simulado.
 * En un entorno real, esto sería un objeto más complejo del picker de imágenes.
 */
export interface SimulatedImageFile {
  name: string; // Nombre del archivo, e.g., 'resonancia.dcm'
  type: string; // Tipo MIME o formato, e.g., 'application/dicom', 'image/jpeg'
  uri: string; // URI local o temporal del archivo
}

/**
 * Define los parámetros para las rutas de navegación de React Navigation.
 * 'undefined' significa que la ruta no espera ningún parámetro.
 */
export type RootStackParamList = {
  PatientDetail: undefined; // La pantalla de detalles del paciente no recibe parámetros inicialmente.
  // Otras pantallas irían aquí
};
```

```typescript filename=src/services/AlertService.ts
// src/services/AlertService.ts
/**
 * @file Servicio para mostrar alertas en la aplicación de forma consistente.
 */
import { Alert } from 'react-native';

class AlertService {
  /**
   * Muestra una alerta con un título y mensaje.
   * @param title Título de la alerta.
   * @param message Mensaje de la alerta.
   */
  public static show(title: string, message: string): void {
    Alert.alert(title, message);
  }
}

export default AlertService;
```

```typescript filename=src/services/PatientService.ts
// src/services/PatientService.ts
/**
 * @file Servicio mock para manejar datos de pacientes.
 * En un escenario real, este servicio interactuaría con una API.
 */

class PatientService {
  /**
   * Simula la obtención de un ID de paciente.
   * En un caso real, esto vendría de un estado global o una API.
   * @returns Un ID de paciente simulado.
   */
  public static getCurrentPatientId(): string {
    // Simulamos un ID de paciente fijo para esta demostración.
    return 'PAT-001-XYZ';
  }

  // Otros métodos relacionados con pacientes irían aquí (ej. getPatientDetails, updatePatient).
}

export default PatientService;
```

```typescript filename=src/services/ImagingService.ts
// src/services/ImagingService.ts
/**
 * @file Servicio para manejar la lógica de importación y validación de imágenes médicas.
 */
import { SimulatedImageFile } from '../types';
import AlertService from './AlertService';

class ImagingService {
  /**
   * Importa una imagen médica, simulando la validación del formato y la integración.
   * Implementa los escenarios Gherkin para importación exitosa y fallida por formato.
   *
   * @param file El objeto de archivo de imagen simulado.
   * @param patientId El ID del paciente al que se asociará la imagen.
   * @returns Una promesa que resuelve con un booleano indicando el éxito de la importación.
   */
  public static async importImage(file: SimulatedImageFile, patientId: string): Promise<boolean> {
    console.log(`Intentando importar archivo: ${file.name} para paciente: ${patientId}`);

    // Simula una demora de red/procesamiento
    await new Promise(resolve => setTimeout(resolve, 1500));

    // Lógica de validación del formato (según Gherkin: DICOM)
    const isDicom = file.type === 'application/dicom';

    if (isDicom) {
      // Scenario: Importación exitosa
      // En un caso real, aquí se llamaría a una API para subir el archivo
      // y asociarlo al paciente.
      console.log(`Imagen DICOM compatible: ${file.name}. Asociando a paciente ${patientId}...`);
      AlertService.show('Importación Exitosa', `La imagen '${file.name}' se ha asociado correctamente al paciente ${patientId}.`);
      return true;
    } else {
      // Scenario: Error de formato no compatible
      const errorMessage = `El formato de archivo '${file.type}' no es compatible. Por favor, seleccione un archivo DICOM.`;
      console.error(errorMessage);
      AlertService.show('Error de Importación', errorMessage);
      return false;
    }
  }

  // Otros métodos relacionados con imágenes (visualización, manipulación, etc.) irían aquí.
}

export default ImagingService;
```

```typescript filename=src/hooks/useImagePicker.ts
// src/hooks/useImagePicker.ts
/**
 * @file Hook personalizado para simular la selección de un archivo de imagen.
 * En un entorno real, este hook utilizaría librerías como `react-native-image-picker` o `expo-document-picker`.
 */
import { useState, useCallback } from 'react';
import { SimulatedImageFile } from '../types';

/**
 * Hook personalizado para simular la selección de un archivo de imagen.
 * @returns Un objeto con el archivo seleccionado, una función para seleccionarlo y una para resetearlo.
 */
export const useImagePicker = () => {
  const [selectedFile, setSelectedFile] = useState<SimulatedImageFile | null>(null);

  /**
   * Simula la apertura de un selector de archivos y la selección de un archivo.
   * Se presentan opciones predefinidas para simular diferentes formatos.
   */
  const pickImage = useCallback(() => {
    // Simulamos la selección de un archivo.
    // En un escenario real, esto abriría el picker de imágenes/documentos.
    const mockFiles: SimulatedImageFile[] = [
      { name: 'resonancia_cabeza.dcm', type: 'application/dicom', uri: 'file://path/to/resonancia_cabeza.dcm' },
      { name: 'radiografia_torax.dcm', type: 'application/dicom', uri: 'file://path/to/radiografia_torax.dcm' },
      { name: 'informe.pdf', type: 'application/pdf', uri: 'file://path/to/informe.pdf' },
      { name: 'foto_lesion.jpeg', type: 'image/jpeg', uri: 'file://path/to/foto_lesion.jpeg' },
    ];

    // Seleccionamos un archivo aleatorio de las opciones simuladas para esta demostración.
    const randomIndex = Math.floor(Math.random() * mockFiles.length);
    setSelectedFile(mockFiles[randomIndex]);
  }, []);

  /**
   * Resetea el archivo seleccionado.
   */
  const resetSelection = useCallback(() => {
    setSelectedFile(null);
  }, []);

  return { selectedFile, pickImage, resetSelection };
};
```

```typescript filename=src/components/StyledButton.tsx
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
```

```typescript filename=src/components/ImageImportModal.tsx
// src/components/ImageImportModal.tsx
/**
 * @file Componente modal para la importación de imágenes médicas.
 * Permite seleccionar un archivo (simulado) y lo importa a través de ImagingService.
 */
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import StyledButton from './StyledButton';
import { useImagePicker } from '../hooks/useImagePicker';
import ImagingService from '../services/ImagingService';
import PatientService from '../services/PatientService'; // Para obtener el patientId

interface ImageImportModalProps {
  isVisible: boolean;
  onClose: () => void;
  patientId: string; // El ID del paciente al que se asociará la imagen
}

const ImageImportModal: React.FC<ImageImportModalProps> = ({ isVisible, onClose, patientId }) => {
  const { selectedFile, pickImage, resetSelection } = useImagePicker();
  const [isImporting, setIsImporting] = useState(false);

  // Resetea la selección de archivo cuando el modal se abre/cierra
  useEffect(() => {
    if (isVisible) {
      resetSelection(); // Limpia cualquier selección anterior al abrir
    }
  }, [isVisible, resetSelection]);

  /**
   * Maneja el evento de importación del archivo.
   * Utiliza el ImagingService para procesar la imagen seleccionada.
   */
  const handleImport = async () => {
    if (!selectedFile) {
      return; // No hay archivo para importar
    }
    setIsImporting(true);
    try {
      // Llamamos al servicio de imágenes para importar el archivo
      const success = await ImagingService.importImage(selectedFile, patientId);
      if (success) {
        onClose(); // Cerrar el modal solo si la importación fue exitosa
      }
    } catch (error) {
      console.error("Error al importar la imagen:", error);
      // El ImagingService ya maneja las alertas, pero aquí se podría añadir un fallback
    } finally {
      setIsImporting(false);
      resetSelection(); // Limpiar la selección después de intentar la importación
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Importar Imagen Médica</Text>

          {/* Botón para simular la selección de archivo */}
          <StyledButton
            title={selectedFile ? "Cambiar Archivo" : "Seleccionar Archivo"}
            onPress={pickImage}
            style={styles.selectButton}
            disabled={isImporting}
          />

          {/* Muestra información del archivo seleccionado */}
          {selectedFile && (
            <View style={styles.fileInfoContainer}>
              <Text style={styles.fileInfoText}>Archivo: {selectedFile.name}</Text>
              <Text style={styles.fileInfoText}>Tipo: {selectedFile.type}</Text>
            </View>
          )}

          {/* Botón para iniciar la importación */}
          <StyledButton
            title="Importar"
            onPress={handleImport}
            isLoading={isImporting}
            disabled={!selectedFile || isImporting}
            style={styles.importButton}
          />

          {/* Botón para cerrar el modal */}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
            disabled={isImporting}
          >
            <Text style={styles.textStyle}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro semitransparente
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
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
    width: '85%', // Ajustar ancho para adaptarse a diferentes pantallas
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#28a745', // Un color verde para seleccionar
    marginBottom: 15,
  },
  fileInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  importButton: {
    backgroundColor: '#007bff', // Color azul para importar
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#dc3545', // Color rojo para cerrar
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ImageImportModal;
```

```typescript filename=src/screens/PatientDetailScreen.tsx
// src/screens/PatientDetailScreen.tsx
/**
 * @file Pantalla de detalles de un paciente.
 * Contiene un botón para abrir el modal de importación de imágenes.
 */
import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import StyledButton from '../components/StyledButton';
import ImageImportModal from '../components/ImageImportModal';
import PatientService from '../services/PatientService'; // Para obtener el patientId

const PatientDetailScreen: React.FC = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const patientId = PatientService.getCurrentPatientId(); // Obtenemos un ID de paciente simulado

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Detalles del Paciente</Text>
      <Text style={styles.patientIdText}>ID del Paciente: {patientId}</Text>
      <Text style={styles.infoText}>Aquí iría información detallada del paciente.</Text>

      {/* Botón para abrir el modal de importación de imágenes */}
      <StyledButton
        title="Importar Imágenes Médicas"
        onPress={() => setIsModalVisible(true)}
        style={styles.openModalButton}
      />

      {/* El modal de importación de imágenes */}
      <ImageImportModal
        isVisible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        patientId={patientId} // Pasamos el ID del paciente al modal
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f0f2f5',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  patientIdText: {
    fontSize: 18,
    marginBottom: 10,
    color: '#555',
  },
  infoText: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 30,
    color: '#666',
  },
  openModalButton: {
    backgroundColor: '#17a2b8', // Un color cian para el botón de abrir modal
    marginTop: 20,
  },
});

export default PatientDetailScreen;
```

```typescript filename=src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx
/**
 * @file Configuración del navegador principal de la aplicación.
 * Utiliza React Navigation para definir la pila de pantallas.
 */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from '../types';
import PatientDetailScreen from '../screens/PatientDetailScreen';

// Creamos un Stack Navigator.
const Stack = createNativeStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Stack.Navigator initialRouteName="PatientDetail">
      {/* Definimos la pantalla de detalles del paciente como la pantalla inicial. */}
      <Stack.Screen
        name="PatientDetail"
        component={PatientDetailScreen}
        options={{ title: 'Historial del Paciente' }}
      />
      {/* Aquí se añadirían otras pantallas de la aplicación. */}
    </Stack.Navigator>
  );
};

export default AppNavigator;
```

```typescript filename=App.tsx
// App.tsx
/**
 * @file Componente raíz de la aplicación React Native.
 * Configura el contenedor de navegación y el navegador principal.
 */
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import AppNavigator from './src/navigation/AppNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const App: React.FC = () => {
  return (
    // SafeAreaProvider es útil para manejar las áreas seguras del dispositivo (notch, etc.)
    <SafeAreaProvider>
      {/* NavigationContainer gestiona el estado de la navegación para toda la aplicación. */}
      <NavigationContainer>
        {/* AppNavigator contiene la definición de todas las pantallas y su flujo. */}
        <AppNavigator />
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
```