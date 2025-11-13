La arquitectura propuesta para la funcionalidad de "Seguimiento del Tratamiento" en React Native con TypeScript se basa en los principios de diseño modular, separación de responsabilidades y reusabilidad de componentes.

**Resumen de la Arquitectura:**

1.  **Pantallas (Screens)**: Representan las vistas principales de la aplicación. Orquestan la lógica y los componentes UI para una sección específica. La `TreatmentMonitoringScreen` será responsable de mostrar el estado del tratamiento de un paciente.
2.  **Componentes (Components)**: Pequeñas y reutilizables piezas de UI. Son presentacionales y reciben datos a través de props. `ComplianceIndicator` y `MissedDoseAlert` son ejemplos clave, cada uno encargado de una parte específica de la visualización del estado del tratamiento.
3.  **Hooks Personalizados (Custom Hooks)**: Encapsulan la lógica de estado y efectos secundarios, promoviendo la reutilización de lógica entre componentes. `useTreatmentMonitoring` gestionará la carga y el estado de los datos del tratamiento.
4.  **Servicios (Services)**: Manejan la interacción con fuentes de datos externas (APIs, almacenamiento local, etc.) o lógica de negocio compleja. `TreatmentService` simulará la obtención del estado del tratamiento de un paciente.
5.  **Tipos (Types)**: Un directorio dedicado para las interfaces de TypeScript, asegurando la robustez y la claridad del código.

Esta estructura facilita la escalabilidad, el mantenimiento y la colaboración en el proyecto, siguiendo las mejores prácticas de desarrollo en React Native.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens):**
    *   `TreatmentMonitoringScreen`: Muestra la información general del seguimiento del tratamiento para un paciente específico. Utiliza el `useTreatmentMonitoring` hook para obtener los datos y renderiza `ComplianceIndicator` y `MissedDoseAlert`.

*   **Componentes (Components):**
    *   `ComplianceIndicator`: Un componente presentacional que visualiza el índice de cumplimiento del tratamiento. Recibe el `complianceRate` como prop y lo muestra de forma gráfica (ej. barra de progreso). Implementa el escenario Gherkin de "cumplimiento alto".
    *   `MissedDoseAlert`: Un componente presentacional que muestra una alerta si el paciente ha omitido dosis. Recibe la cantidad de `missedDoses` como prop y solo se renderiza si es mayor que cero. Implementa el escenario Gherkin de "alerta de incumplimiento".

*   **Hooks Personalizados (Custom Hooks):**
    *   `useTreatmentMonitoring`: Hook que encapsula la lógica para cargar el estado del tratamiento de un paciente. Maneja los estados de carga, error y los datos del tratamiento, interactuando con `TreatmentService`.

*   **Servicios (Services):**
    *   `TreatmentService`: Servicio que simula la interacción con un backend para obtener el estado del tratamiento de un paciente. Contiene el método `getTreatmentStatus(patientId)`.

*   **Tipos (Types):**
    *   `src/types/treatment.ts`: Define las interfaces para la estructura de datos `TreatmentStatus`.

---

### 2) Estructura de Archivos

```
src/
├── components/
│   ├── ComplianceIndicator.tsx
│   └── MissedDoseAlert.tsx
├── hooks/
│   └── useTreatmentMonitoring.ts
├── navigation/
│   └── AppNavigator.tsx  // (Asumido para la navegación, no se generará código para este)
├── screens/
│   └── TreatmentMonitoringScreen.tsx
├── services/
│   └── TreatmentService.ts
└── types/
    └── treatment.ts
```

---

### 3) Código Fuente

```typescript filename=src/types/treatment.ts
/**
 * src/types/treatment.ts
 * Define las interfaces de TypeScript para los datos relacionados con el tratamiento.
 */

/**
 * Interfaz que define la estructura de datos para el estado del tratamiento de un paciente.
 * @property {number} complianceRate - Tasa de cumplimiento del tratamiento (entre 0.0 y 1.0).
 * @property {number} missedDoses - Número de dosis omitidas por el paciente.
 */
export interface TreatmentStatus {
  complianceRate: number;
  missedDoses: number;
}
```

```typescript filename=src/services/TreatmentService.ts
import { TreatmentStatus } from '../types/treatment';

/**
 * src/services/TreatmentService.ts
 * Servicio para simular la obtención del estado del tratamiento de un paciente.
 * En un entorno real, esto interactuaría con una API REST.
 */
class TreatmentService {
  /**
   * Simula la obtención del estado del tratamiento para un paciente.
   * La respuesta varía para simular los escenarios de Gherkin:
   * - Si patientId es 'patient123' o termina en un número par, simula cumplimiento alto.
   * - Si patientId es 'patient456' o termina en un número impar, simula dosis omitidas.
   * @param {string} patientId - El ID del paciente cuyo estado de tratamiento se desea obtener.
   * @returns {Promise<TreatmentStatus>} Una promesa que resuelve con el estado del tratamiento.
   */
  async getTreatmentStatus(patientId: string): Promise<TreatmentStatus> {
    console.log(`[TreatmentService] Simulando carga de estado para el paciente: ${patientId}`);

    return new Promise((resolve) => {
      setTimeout(() => {
        // Simula diferentes escenarios basados en el patientId para testing
        if (patientId === 'patient123' || parseInt(patientId.slice(-1)) % 2 === 0) {
          // Escenario: Paciente cumple tratamiento (cumplimiento alto)
          resolve({
            complianceRate: 0.95, // 95% de cumplimiento
            missedDoses: 0,
          });
        } else {
          // Escenario: Paciente omite dosis (cumplimiento bajo, alerta)
          resolve({
            complianceRate: 0.50, // 50% de cumplimiento
            missedDoses: 3,
          });
        }
      }, 1500); // Retardo de 1.5 segundos para simular una llamada a la red
    });
  }
}

export default new TreatmentService();
```

```typescript filename=src/hooks/useTreatmentMonitoring.ts
import { useState, useEffect } from 'react';
import TreatmentService from '../services/TreatmentService';
import { TreatmentStatus } from '../types/treatment';

/**
 * src/hooks/useTreatmentMonitoring.ts
 * Hook personalizado para gestionar la lógica de carga y estado del tratamiento de un paciente.
 * Abstrae la interacción con el TreatmentService.
 */
export const useTreatmentMonitoring = (patientId: string) => {
  const [treatmentStatus, setTreatmentStatus] = useState<TreatmentStatus | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTreatmentStatus = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const status = await TreatmentService.getTreatmentStatus(patientId);
        setTreatmentStatus(status);
      } catch (err) {
        console.error('Error al cargar el estado del tratamiento:', err);
        setError('No se pudo cargar el estado del tratamiento.');
      } finally {
        setIsLoading(false);
      }
    };

    if (patientId) {
      fetchTreatmentStatus();
    } else {
      setIsLoading(false);
      setError('ID de paciente no proporcionado.');
    }
  }, [patientId]); // Vuelve a cargar si el ID del paciente cambia

  return { treatmentStatus, isLoading, error };
};
```

```typescript filename=src/components/ComplianceIndicator.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import * as Progress from 'react-native-progress'; // Asume que se usa una librería de progreso

/**
 * src/components/ComplianceIndicator.tsx
 * Componente presentacional que muestra el índice de cumplimiento del tratamiento.
 * Implementa el escenario Gherkin de "cumplimiento alto".
 * Usará react-native-progress para una visualización simple.
 */

interface ComplianceIndicatorProps {
  complianceRate: number; // Tasa de cumplimiento entre 0.0 y 1.0
}

const ComplianceIndicator: React.FC<ComplianceIndicatorProps> = ({ complianceRate }) => {
  const percentage = Math.round(complianceRate * 100);
  const color = complianceRate >= 0.8 ? '#4CAF50' : complianceRate >= 0.5 ? '#FFC107' : '#F44336'; // Verde, Amarillo, Rojo

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cumplimiento del Tratamiento</Text>
      <Progress.Bar
        progress={complianceRate}
        width={null} // Ocupa el ancho disponible
        height={20}
        color={color}
        unfilledColor="#e0e0e0"
        borderColor="#ccc"
        borderRadius={10}
        style={styles.progressBar}
      />
      <Text style={[styles.percentageText, { color }]}>{percentage}%</Text>
      {complianceRate >= 0.8 && (
        <Text style={styles.statusText}>¡Excelente adherencia al tratamiento!</Text>
      )}
      {complianceRate < 0.8 && complianceRate >= 0.5 && (
        <Text style={styles.statusText}>Adherencia moderada, revisar.</Text>
      )}
      {complianceRate < 0.5 && (
        <Text style={styles.statusText}>Baja adherencia, requiere atención urgente.</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  progressBar: {
    width: '100%',
    marginBottom: 8,
  },
  percentageText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  statusText: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default ComplianceIndicator;
```

```typescript filename=src/components/MissedDoseAlert.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Asume que se usa react-native-vector-icons

/**
 * src/components/MissedDoseAlert.tsx
 * Componente presentacional que muestra una alerta si el paciente ha omitido dosis.
 * Implementa el escenario Gherkin de "alerta de incumplimiento".
 */

interface MissedDoseAlertProps {
  missedDoses: number; // Número de dosis omitidas
}

const MissedDoseAlert: React.FC<MissedDoseAlertProps> = ({ missedDoses }) => {
  if (missedDoses <= 0) {
    return null; // No mostrar nada si no hay dosis omitidas
  }

  return (
    <View style={styles.alertContainer}>
      <Icon name="warning" size={30} color="#FFD700" style={styles.icon} />
      <View style={styles.textContainer}>
        <Text style={styles.alertTitle}>Alerta de Incumplimiento</Text>
        <Text style={styles.alertMessage}>
          El paciente ha omitido {missedDoses} dosis. Se recomienda revisar la adherencia y ajustar el plan de tratamiento si es necesario.
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  alertContainer: {
    flexDirection: 'row',
    backgroundColor: '#FFFBE0', // Fondo amarillo claro para la alerta
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#FFD700', // Borde amarillo
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  icon: {
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#CC8400', // Naranja oscuro para el título
    marginBottom: 5,
  },
  alertMessage: {
    fontSize: 14,
    color: '#664200', // Marrón oscuro para el mensaje
  },
});

export default MissedDoseAlert;
```

```typescript filename=src/screens/TreatmentMonitoringScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack'; // Para props de navegación
import { useTreatmentMonitoring } from '../hooks/useTreatmentMonitoring';
import ComplianceIndicator from '../components/ComplianceIndicator';
import MissedDoseAlert from '../components/MissedDoseAlert';

/**
 * src/screens/TreatmentMonitoringScreen.tsx
 * Pantalla principal para el seguimiento del tratamiento de un paciente.
 * Muestra el estado del tratamiento, incluyendo el cumplimiento y las dosis omitidas.
 * Esta pantalla asume el uso de React Navigation.
 *
 * Para propósitos de simulación, el 'patientId' se podría pasar vía params de navegación,
 * o se usa un valor fijo para demostración.
 */

// Define los tipos de parámetros para tu Stack Navigator.
// Aquí, asumimos un PatientStack para simplificar.
type RootStackParamList = {
  TreatmentMonitoring: { patientId: string };
  // Otras pantallas...
};

type TreatmentMonitoringScreenProps = StackScreenProps<RootStackParamList, 'TreatmentMonitoring'>;

const TreatmentMonitoringScreen: React.FC<TreatmentMonitoringScreenProps> = ({ route }) => {
  // En una aplicación real, el patientId vendría de los parámetros de navegación.
  // const { patientId } = route.params;
  // Para la simulación, usaremos un ID fijo o lo podemos alternar para probar ambos escenarios.
  const patientId = 'patient123'; // Cambiar a 'patient456' o 'patient123' para probar escenarios

  const { treatmentStatus, isLoading, error } = useTreatmentMonitoring(patientId);

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>Cargando estado del tratamiento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  if (!treatmentStatus) {
    return (
      <View style={styles.centered}>
        <Text style={styles.noDataText}>No se encontró información del tratamiento para este paciente.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Seguimiento del Tratamiento</Text>
      <Text style={styles.patientIdText}>Paciente ID: {patientId}</Text>

      {/* Componente para mostrar el indicador de cumplimiento */}
      <ComplianceIndicator complianceRate={treatmentStatus.complianceRate} />

      {/* Componente para mostrar la alerta de dosis omitidas */}
      <MissedDoseAlert missedDoses={treatmentStatus.missedDoses} />

      {/* Información adicional del tratamiento si se desea */}
      <View style={styles.infoBox}>
        <Text style={styles.infoTitle}>Detalles Adicionales</Text>
        <Text style={styles.infoText}>Próxima revisión: 15/11/2025</Text>
        <Text style={styles.infoText}>Medicamento principal: Ibuprofeno 600mg</Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    fontSize: 18,
    color: '#D32F2F',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    textAlign: 'center',
    marginHorizontal: 20,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
    textAlign: 'center',
  },
  patientIdText: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    marginVertical: 10,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  infoText: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
  },
});

export default TreatmentMonitoringScreen;
```