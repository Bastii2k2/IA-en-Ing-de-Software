Aquí tienes la arquitectura diseñada para la Historia de Usuario 8: Alertas y Notificaciones de Medicación, siguiendo las instrucciones proporcionadas.

### Resumen de la Arquitectura

La arquitectura propuesta para manejar las alertas y notificaciones de medicación se basa en una clara separación de responsabilidades:

1.  **Capa de Servicios (`NotificationService.ts`):** Este servicio actúa como el `cerebro` de las notificaciones. Es una clase singleton que encapsula la lógica para simular la detección de interacciones medicamentosas y la programación de recordatorios de dosis. Su principal responsabilidad es emitir eventos a sus suscriptores, sin tener conocimiento de la UI.
2.  **Capa de Hooks (`useNotificationListener.ts`):** Este hook personalizado es el `oído` de la interfaz de usuario. Se encarga de suscribirse al `NotificationService`. Cuando el servicio emite un evento (una interacción detectada o una notificación de dosis), el hook lo intercepta y se encarga de mostrar la alerta correspondiente en la interfaz de usuario utilizando `Alert` de React Native.
3.  **Capa de Pantallas (`MedicationNotificationScreen.tsx`):** Esta pantalla es la `cara` de la aplicación. Es una UI sencilla que permite al usuario interactuar y desencadenar las simulaciones del `NotificationService`. Aquí se instancia y utiliza el `useNotificationListener` para que la pantalla pueda reaccionar a los eventos del servicio.
4.  **Navegación (`AppNavigator.tsx`):** Un navegador simple (`Stack Navigator`) para estructurar las pantallas de la aplicación.
5.  **Componente Raíz (`App.tsx`):** El punto de entrada principal que inicializa el navegador.

Esta estructura promueve la reusabilidad, la testabilidad y la mantenibilidad, evitando "God Components" y asegurando que la lógica de negocio esté desacoplada de la interfaz de usuario.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens):**
    *   `MedicationNotificationScreen`: Pantalla principal que sirve como interfaz de demostración para las funcionalidades de alertas y notificaciones. Contiene botones para simular la detección de interacciones y la programación de dosis, y utiliza el hook `useNotificationListener` para mostrar las alertas.

*   **Componentes Reutilizables (Components):**
    *   Para esta historia de usuario, se usará directamente el componente `Button` de `react-native` para simplificar la demostración. En un proyecto real, se podría tener un `StyledButton` o `PrimaryButton` si la aplicación tuviera un sistema de diseño más elaborado.

*   **Hooks Personalizados (Hooks):**
    *   `useNotificationListener`: Un hook que se suscribe a los eventos del `NotificationService` y muestra alertas nativas de React Native (`Alert.alert`) cuando se recibe una notificación de interacción o de dosis. Gestiona la suscripción y desuscripción.

*   **Servicios (Services):**
    *   `NotificationService`: Un servicio singleton que contiene la lógica para simular la detección de interacciones medicamentosas (basado en una lista predefinida) y la programación de recordatorios de dosis (usando `setTimeout`). Proporciona métodos para que los componentes puedan suscribirse a sus eventos de notificación.

*   **Utilidades (Utils):**
    *   `constants.ts`: Archivo para almacenar constantes como nombres de medicamentos de prueba e interacciones simuladas.

---

### 2) Estructura de Archivos

```
src/
├── navigation/
│   └── AppNavigator.tsx            // Navegador principal de la aplicación
├── screens/
│   └── MedicationNotificationScreen.tsx // Pantalla de demostración de notificaciones
├── services/
│   └── NotificationService.ts      // Servicio para la lógica de notificaciones
├── hooks/
│   └── useNotificationListener.ts  // Hook para escuchar y mostrar notificaciones
├── utils/
│   └── constants.ts                // Constantes y datos de prueba
└── App.tsx                         // Componente raíz de la aplicación
```

---

### 3) Código Fuente

```typescript filename=src/utils/constants.ts
// src/utils/constants.ts

// Lista de medicamentos que, si se toman juntos, simularán una interacción adversa.
export const INCOMPATIBLE_MEDS: string[] = ['Warfarina', 'Ibuprofeno'];
```

```typescript filename=src/services/NotificationService.ts
// src/services/NotificationService.ts

import { INCOMPATIBLE_MEDS } from '../utils/constants';

// Tipos para las notificaciones y el callback de suscripción.
export type NotificationType = 'interaction' | 'dose';
export type NotificationCallback = (type: NotificationType, message: string) => void;

/**
 * Servicio singleton para manejar la lógica de notificaciones de medicación.
 * Simula la detección de interacciones y la programación de dosis.
 */
class NotificationService {
  private static instance: NotificationService;
  private subscribers: NotificationCallback[] = [];

  private constructor() {
    // Constructor privado para asegurar que solo exista una instancia (Singleton).
  }

  /**
   * Obtiene la única instancia del NotificationService.
   */
  public static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  /**
   * Suscribe un callback para recibir notificaciones.
   * @param callback La función a llamar cuando se emite una notificación.
   */
  public subscribe(callback: NotificationCallback): void {
    this.subscribers.push(callback);
    console.log('Subscriptor añadido. Total:', this.subscribers.length);
  }

  /**
   * Desuscribe un callback para dejar de recibir notificaciones.
   * @param callback La función a remover de la lista de suscriptores.
   */
  public unsubscribe(callback: NotificationCallback): void {
    this.subscribers = this.subscribers.filter(sub => sub !== callback);
    console.log('Subscriptor removido. Total:', this.subscribers.length);
  }

  /**
   * Notifica a todos los suscriptores.
   * @param type El tipo de notificación ('interaction' o 'dose').
   * @param message El mensaje de la notificación.
   */
  private notifySubscribers(type: NotificationType, message: string): void {
    console.log(`Notificando a suscriptores: [${type}] ${message}`);
    this.subscribers.forEach(callback => callback(type, message));
  }

  /**
   * Simula la verificación de interacciones medicamentosas.
   * Escenario Gherkin: "Interacción de medicamentos detectada"
   * @param medicationList Una lista de medicamentos que el paciente está tomando.
   */
  public checkMedicationInteractions(medicationList: string[]): void {
    console.log('Verificando interacciones para:', medicationList);
    const lowerCaseMedList = medicationList.map(med => med.toLowerCase());
    const incompatibleMedLC = INCOMPATIBLE_MEDS.map(med => med.toLowerCase());

    // Simulación simple: si ambos medicamentos incompatibles están en la lista, se detecta una interacción.
    const hasMed1 = lowerCaseMedList.includes(incompatibleMedLC[0]);
    const hasMed2 = lowerCaseMedList.includes(incompatibleMedLC[1]);

    if (hasMed1 && hasMed2) {
      const message = `¡Alerta! Interacción detectada entre ${INCOMPATIBLE_MEDS[0]} y ${INCOMPATIBLE_MEDS[1]}. Consulta a tu médico.`;
      this.notifySubscribers('interaction', message);
    } else {
      console.log('No se detectaron interacciones peligrosas entre los medicamentos actuales.');
    }
  }

  /**
   * Simula la programación de una notificación de dosis.
   * Escenario Gherkin: "Notificación de dosis"
   * @param medicationName El nombre del medicamento para el cual se programa la dosis.
   * @param delayMs El retraso en milisegundos antes de que se dispare la notificación.
   */
  public scheduleDoseNotification(medicationName: string, delayMs: number): void {
    console.log(`Programando notificación de dosis para ${medicationName} en ${delayMs / 1000} segundos.`);
    setTimeout(() => {
      const message = `¡Es hora de tu dosis! Recuerda tomar ${medicationName}.`;
      this.notifySubscribers('dose', message);
      console.log(`Notificación de dosis disparada para ${medicationName}.`);
    }, delayMs);
  }
}

// Exporta la instancia única del servicio.
export const notificationService = NotificationService.getInstance();
```

```typescript filename=src/hooks/useNotificationListener.ts
// src/hooks/useNotificationListener.ts

import { useEffect } from 'react';
import { Alert } from 'react-native';
import { notificationService, NotificationType, NotificationCallback } from '../services/NotificationService';

/**
 * Hook personalizado para escuchar notificaciones del NotificationService
 * y mostrarlas como alertas de React Native.
 *
 * Este hook debe ser llamado dentro de un componente de React para que
 * se gestione correctamente la suscripción y desuscripción al servicio.
 */
export const useNotificationListener = () => {
  useEffect(() => {
    // Define el callback que se ejecutará cuando el servicio emita una notificación.
    const handleNotification: NotificationCallback = (type, message) => {
      let title = '';
      switch (type) {
        case 'interaction':
          title = '¡Alerta de Interacción Medicamentosa!';
          break;
        case 'dose':
          title = 'Recordatorio de Dosis';
          break;
        default:
          title = 'Notificación';
      }
      Alert.alert(title, message); // Muestra la alerta nativa de React Native.
    };

    // Suscribe el callback al servicio cuando el componente se monta.
    notificationService.subscribe(handleNotification);
    console.log('useNotificationListener: Suscrito al NotificationService.');

    // Función de limpieza para desuscribir el callback cuando el componente se desmonta.
    return () => {
      notificationService.unsubscribe(handleNotification);
      console.log('useNotificationListener: Desuscrito del NotificationService.');
    };
  }, []); // El array vacío asegura que el efecto se ejecute solo una vez al montar y desmontar.
};
```

```typescript filename=src/screens/MedicationNotificationScreen.tsx
// src/screens/MedicationNotificationScreen.tsx

import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput, Alert, ScrollView } from 'react-native';
import { useNotificationListener } from '../hooks/useNotificationListener';
import { notificationService } from '../services/NotificationService';
import { INCOMPATIBLE_MEDS } from '../utils/constants';

/**
 * Pantalla de demostración para las alertas y notificaciones de medicación.
 * Permite simular la detección de interacciones y la programación de dosis.
 */
const MedicationNotificationScreen: React.FC = () => {
  // Utiliza el hook para escuchar y mostrar notificaciones.
  useNotificationListener();

  const [currentMedications, setCurrentMedications] = useState<string[]>([]);
  const [newMedication, setNewMedication] = useState<string>('');
  const [doseMedicationName, setDoseMedicationName] = useState<string>('');

  /**
   * Añade un nuevo medicamento a la lista actual del paciente.
   */
  const addMedication = () => {
    if (newMedication.trim()) {
      setCurrentMedications([...currentMedications, newMedication.trim()]);
      setNewMedication('');
    } else {
      Alert.alert('Error', 'Por favor, ingresa un nombre de medicamento válido.');
    }
  };

  /**
   * Elimina un medicamento de la lista actual.
   * @param medToDelete El nombre del medicamento a eliminar.
   */
  const removeMedication = (medToDelete: string) => {
    setCurrentMedications(currentMedications.filter(med => med !== medToDelete));
  };

  /**
   * Dispara la simulación de verificación de interacciones llamando al servicio.
   */
  const handleCheckInteractions = () => {
    if (currentMedications.length < 1) {
      Alert.alert('Información', 'Por favor, añade al menos un medicamento para verificar interacciones.');
      return;
    }
    notificationService.checkMedicationInteractions(currentMedications);
  };

  /**
   * Dispara la simulación de notificación de dosis llamando al servicio.
   */
  const handleScheduleDose = () => {
    if (doseMedicationName.trim()) {
      // Simula una notificación en 5 segundos.
      notificationService.scheduleDoseNotification(doseMedicationName.trim(), 5000);
      Alert.alert('Programado', `Notificación de dosis para "${doseMedicationName.trim()}" programada en 5 segundos.`);
      setDoseMedicationName('');
    } else {
      Alert.alert('Error', 'Por favor, ingresa el nombre del medicamento para la dosis.');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.header}>Alertas y Notificaciones de Medicación</Text>

      {/* Sección para simular interacciones */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simular Interacciones de Medicamentos</Text>
        <Text style={styles.instructionText}>
          Añade medicamentos. Prueba a añadir "{INCOMPATIBLE_MEDS[0]}" y "{INCOMPATIBLE_MEDS[1]}" para ver una interacción.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre del medicamento"
          value={newMedication}
          onChangeText={setNewMedication}
        />
        <Button title="Añadir Medicamento" onPress={addMedication} />

        <View style={styles.medicationsList}>
          <Text style={styles.listTitle}>Tus medicamentos actuales:</Text>
          {currentMedications.length === 0 ? (
            <Text style={styles.noMedsText}>No hay medicamentos añadidos.</Text>
          ) : (
            currentMedications.map((med, index) => (
              <View key={index} style={styles.medicationItem}>
                <Text style={styles.medicationText}>{med}</Text>
                <Button title="X" onPress={() => removeMedication(med)} color="red" />
              </View>
            ))
          )}
        </View>
        <View style={styles.buttonSpacer} />
        <Button title="Verificar Interacciones Ahora" onPress={handleCheckInteractions} />
      </View>

      {/* Sección para simular notificación de dosis */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Simular Notificación de Dosis</Text>
        <Text style={styles.instructionText}>
          Programa una notificación que aparecerá en 5 segundos.
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Medicamento para la dosis (ej: Paracetamol)"
          value={doseMedicationName}
          onChangeText={setDoseMedicationName}
        />
        <Button title="Programar Notificación de Dosis" onPress={handleScheduleDose} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f4f7',
  },
  contentContainer: {
    padding: 20,
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
    textAlign: 'center',
  },
  section: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  instructionText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 15,
    lineHeight: 20,
  },
  input: {
    height: 45,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 15,
    marginBottom: 15,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  buttonSpacer: {
    height: 15, // Espacio entre botones
  },
  medicationsList: {
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 15,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 10,
    color: '#444',
  },
  medicationItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#f5f5f5',
  },
  medicationText: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  noMedsText: {
    fontStyle: 'italic',
    color: '#888',
    textAlign: 'center',
    marginTop: 10,
  },
});

export default MedicationNotificationScreen;
```

```typescript filename=src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MedicationNotificationScreen from '../screens/MedicationNotificationScreen';

// Define los parámetros para las rutas de navegación.
// En este caso, MedicationNotificationScreen no requiere parámetros.
export type RootStackParamList = {
  MedicationNotification: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Componente principal del navegador de la aplicación.
 * Utiliza un Stack Navigator para gestionar las pantallas.
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MedicationNotification">
        <Stack.Screen
          name="MedicationNotification"
          component={MedicationNotificationScreen}
          options={{ title: 'Alertas de Medicación' }} // Título en la barra superior
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

```typescript filename=src/App.tsx
// src/App.tsx

import 'react-native-gesture-handler'; // Importación requerida por React Navigation
import React from 'react';
import AppNavigator from './navigation/AppNavigator';

/**
 * Componente raíz de la aplicación.
 * Renderiza el AppNavigator que contiene toda la estructura de navegación.
 */
const App: React.FC = () => {
  return (
    <AppNavigator />
  );
};

export default App;
```