Aquí tienes la arquitectura y el código React Native (TypeScript) para la Historia de Usuario 5: Visualización y Análisis de Imágenes Médicas.

---

### Resumen de la Arquitectura

La arquitectura diseñada para la visualización de imágenes médicas se centra en la modularidad y la separación de responsabilidades. Utiliza una `Screen` (`MedicalImageViewerScreen`) como punto de entrada, la cual recibe el `imageUrl` a través de los parámetros de navegación. El componente principal y reutilizable es `MedicalImageViewer`, que se encarga de renderizar la imagen y sus controles interactivos.

Para gestionar la lógica de estado de `zoom` y `contraste`, se ha creado un `Hook` personalizado (`useImageViewer`), manteniendo el componente `MedicalImageViewer` enfocado en la UI. Los controles de `zoom` y `contraste` se implementan mediante un componente `Slider` (utilizando `@react-native-community/slider` para una implementación robusta).

Un `ImageService` se incluye como un servicio simulado para manejar futuras operaciones relacionadas con imágenes, como la obtención de URLs o metadatos de un backend. El diseño cumple con los principios de composición, evita "God Components" y maneja el escenario de "imagen no disponible" mostrando un mensaje adecuado. Se ha asumido el uso de 'React Navigation' para la gestión de la navegación entre pantallas. Para la "simulación" de contraste, se ha optado por usar `tintColor` en la imagen, que es una aproximación visual simplificada, ya que el control real de contraste requiere librerías más avanzadas o procesamiento nativo.

---

### 1) Plan de Componentes y Pantallas

*   **Pantallas (Screens):**
    *   `MedicalImageViewerScreen`: Pantalla principal que orquesta la visualización de la imagen. Obtiene la URL de la imagen de los parámetros de navegación y la pasa al componente `MedicalImageViewer`.

*   **Componentes Reutilizables (Components):**
    *   `MedicalImageViewer`: Componente central que muestra la imagen médica y sus controles de zoom y contraste. Recibe la URL de la imagen como prop.
    *   `Slider`: Componente genérico para controles deslizantes, usado para ajustar zoom y contraste. Se usará una implementación de `@react-native-community/slider`.
    *   `StyledButton`: Componente de botón básico para acciones.

*   **Hooks Personalizados (Hooks):**
    *   `useImageViewer`: Hook que encapsula la lógica de estado para `zoomLevel` y `contrastLevel`, así como las funciones para modificarlos.

*   **Servicios (Services):**
    *   `ImageService`: Servicio simulado para manejar operaciones relacionadas con imágenes médicas, como la "obtención" de URLs de imágenes.

*   **Navegación:**
    *   `AppNavigator`: Configuración de la navegación con `React Navigation`, definiendo la pila de pantallas.

*   **Tipos y Utilidades:**
    *   `src/types/index.ts`: Definiciones de tipos e interfaces compartidas.
    *   `src/theme/colors.ts`: Definiciones de colores para estilos consistentes.

### 2) Estructura de Archivos

```
src/
├── navigation/
│   └── AppNavigator.tsx
├── screens/
│   └── MedicalImageViewerScreen.tsx
├── components/
│   ├── common/
│   │   ├── Slider.tsx
│   │   └── StyledButton.tsx
│   └── MedicalImageViewer/
│       └── MedicalImageViewer.tsx
├── hooks/
│   └── useImageViewer.ts
├── services/
│   └── ImageService.ts
├── theme/
│   └── colors.ts
└── types/
    └── index.ts
```

---

### 3) Código Fuente

```typescript filename=src/types/index.ts
// src/types/index.ts
/**
 * @file Definiciones de tipos e interfaces compartidas para la aplicación.
 */

/**
 * Define los parámetros de navegación para la pantalla MedicalImageViewerScreen.
 * @property {string | null | undefined} imageUrl - La URL de la imagen médica a visualizar.
 */
export type MedicalImageViewerScreenParams = {
  imageUrl?: string | null;
};
```

```typescript filename=src/theme/colors.ts
// src/theme/colors.ts
/**
 * @file Define una paleta de colores estándar para la aplicación.
 * Ayuda a mantener una consistencia visual.
 */

export const colors = {
  primary: '#007bff',
  secondary: '#6c757d',
  success: '#28a745',
  danger: '#dc3545',
  warning: '#ffc107',
  info: '#17a2b8',
  light: '#f8f9fa',
  dark: '#343a40',
  white: '#ffffff',
  black: '#000000',
  gray: '#666666',
  lightGray: '#cccccc',
};
```

```typescript filename=src/components/common/StyledButton.tsx
// src/components/common/StyledButton.tsx
import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors } from '../../theme/colors';

/**
 * @interface StyledButtonProps
 * @property {string} title - Texto a mostrar en el botón.
 * @property {() => void} onPress - Función a ejecutar al presionar el botón.
 * @property {ViewStyle} [style] - Estilos adicionales para el contenedor del botón.
 * @property {TextStyle} [textStyle] - Estilos adicionales para el texto del botón.
 */
interface StyledButtonProps {
  title: string;
  onPress: () => void;
  style?: ViewStyle;
  textStyle?: TextStyle;
}

/**
 * Componente de botón estilizado y reutilizable.
 * @param {StyledButtonProps} props - Propiedades del botón.
 * @returns {JSX.Element} Un componente TouchableOpacity con un texto.
 */
const StyledButton: React.FC<StyledButtonProps> = ({ title, onPress, style, textStyle }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={[styles.buttonText, textStyle]}>{title}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 5,
  },
  buttonText: {
    color: colors.white,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default StyledButton;
```

```typescript filename=src/components/common/Slider.tsx
// src/components/common/Slider.tsx
import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
// Se usa @react-native-community/slider para un control deslizante estándar y robusto.
// Asegúrate de instalarlo: npm install @react-native-community/slider
import RNSlider from '@react-native-community/slider';
import { colors } from '../../theme/colors';

/**
 * @interface SliderProps
 * @property {string} label - Etiqueta descriptiva para el slider.
 * @property {number} value - Valor actual del slider.
 * @property {(value: number) => void} onValueChange - Función callback que se ejecuta al cambiar el valor.
 * @property {number} minimumValue - Valor mínimo del slider.
 * @property {number} maximumValue - Valor máximo del slider.
 * @property {number} [step] - Incremento o decremento de los valores del slider (por defecto 0).
 * @property {ViewStyle} [style] - Estilos adicionales para el contenedor del slider.
 * @property {TextStyle} [labelStyle] - Estilos adicionales para la etiqueta.
 */
interface SliderProps {
  label: string;
  value: number;
  onValueChange: (value: number) => void;
  minimumValue: number;
  maximumValue: number;
  step?: number;
  style?: ViewStyle;
  labelStyle?: TextStyle;
}

/**
 * Componente de Slider reutilizable con etiqueta.
 * @param {SliderProps} props - Propiedades del slider.
 * @returns {JSX.Element} Un componente View que contiene la etiqueta y el RNSlider.
 */
const Slider: React.FC<SliderProps> = ({
  label,
  value,
  onValueChange,
  minimumValue,
  maximumValue,
  step = 0, // Default step 0 means any float value
  style,
  labelStyle,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={[styles.label, labelStyle]}>{label}: {value.toFixed(1)}</Text>
      <RNSlider
        style={styles.slider}
        minimumValue={minimumValue}
        maximumValue={maximumValue}
        step={step}
        value={value}
        onValueChange={onValueChange}
        minimumTrackTintColor={colors.primary}
        maximumTrackTintColor={colors.lightGray}
        thumbTintColor={colors.primary}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    paddingHorizontal: 10,
    marginVertical: 8,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: colors.dark,
    fontWeight: 'bold',
  },
  slider: {
    width: '100%',
    height: 40,
  },
});

export default Slider;
```

```typescript filename=src/services/ImageService.ts
// src/services/ImageService.ts
/**
 * @file Servicio para simular la obtención o manipulación de URLs de imágenes médicas.
 * En un entorno real, este servicio interactuaría con una API REST para obtener datos.
 */

class ImageService {
  /**
   * Simula la obtención de la URL de una imagen médica.
   * Podría tomar un ID de paciente, un tipo de estudio, etc., en el futuro.
   * @param {string} patientId - ID del paciente (simulado).
   * @returns {Promise<string | null>} Una promesa que resuelve con la URL de la imagen
   *                                    o null si no hay imagen (simulado).
   */
  async getMedicalImageUrl(patientId: string): Promise<string | null> {
    console.log(`Simulando la obtención de imagen para el paciente: ${patientId}`);
    // Simulación de una llamada a API
    return new Promise((resolve) => {
      setTimeout(() => {
        // Simular que algunos pacientes no tienen imágenes o que la API devuelve null
        if (patientId === 'patient123') {
          resolve('https://via.placeholder.com/600x400/0000FF/FFFFFF?text=MRI_Brain_Scan');
        } else if (patientId === 'patient456') {
          resolve('https://via.placeholder.com/600x400/FF0000/FFFFFF?text=XRay_Chest');
        } else if (patientId === 'no_image_patient') {
          resolve(null); // Simular que no hay imagen disponible
        } else {
          resolve('https://via.placeholder.com/600x400/00FF00/000000?text=Default_Scan'); // Default
        }
      }, 1000); // Retraso para simular latencia de red
    });
  }
}

export const imageService = new ImageService();
```

```typescript filename=src/hooks/useImageViewer.ts
// src/hooks/useImageViewer.ts
import { useState, useCallback } from 'react';

/**
 * @interface ImageViewerState
 * @property {number} zoomLevel - Nivel actual de zoom.
 * @property {number} contrastLevel - Nivel actual de contraste.
 */
interface ImageViewerState {
  zoomLevel: number;
  contrastLevel: number;
}

/**
 * @interface ImageViewerActions
 * @property {(newZoom: number) => void} setZoomLevel - Función para actualizar el nivel de zoom.
 * @property {(newContrast: number) => void} setContrastLevel - Función para actualizar el nivel de contraste.
 */
interface ImageViewerActions {
  setZoomLevel: (newZoom: number) => void;
  setContrastLevel: (newContrast: number) => void;
}

/**
 * Hook personalizado para gestionar el estado de zoom y contraste de una imagen.
 * Encapsula la lógica de manipulación de estos parámetros.
 *
 * @returns {[ImageViewerState, ImageViewerActions]} Un array que contiene el estado actual
 *                                                  y las funciones para modificarlo.
 */
export const useImageViewer = (): [ImageViewerState, ImageViewerActions] => {
  const [zoomLevel, setZoomLevelState] = useState<number>(1.0); // Valor inicial de zoom (1 = sin zoom)
  const [contrastLevel, setContrastLevelState] = useState<number>(1.0); // Valor inicial de contraste (1 = normal)

  // Memoizar las funciones de actualización para evitar re-renders innecesarios.
  const handleSetZoomLevel = useCallback((newZoom: number) => {
    // Asegurar que el zoom esté dentro de un rango razonable
    setZoomLevelState(Math.max(0.5, Math.min(3.0, newZoom)));
  }, []);

  const handleSetContrastLevel = useCallback((newContrast: number) => {
    // Asegurar que el contraste esté dentro de un rango razonable
    setContrastLevelState(Math.max(0.5, Math.min(2.0, newContrast)));
  }, []);

  return [
    { zoomLevel, contrastLevel },
    { setZoomLevel: handleSetZoomLevel, setContrastLevel: handleSetContrastLevel },
  ];
};
```

```typescript filename=src/components/MedicalImageViewer/MedicalImageViewer.tsx
// src/components/MedicalImageViewer/MedicalImageViewer.tsx
import React from 'react';
import { View, Image, Text, StyleSheet, Dimensions, Platform } from 'react-native';
import { useImageViewer } from '../../hooks/useImageViewer';
import Slider from '../common/Slider';
import { colors } from '../../theme/colors';

const { width } = Dimensions.get('window');

/**
 * @interface MedicalImageViewerProps
 * @property {string | null | undefined} imageUrl - La URL de la imagen médica a mostrar.
 */
interface MedicalImageViewerProps {
  imageUrl: string | null | undefined;
}

/**
 * Componente principal para visualizar y manipular imágenes médicas.
 * Permite ajustar el zoom y el contraste de la imagen.
 * Implementa el escenario Gherkin alternativo: si la URL es nula o vacía,
 * muestra "No hay imágenes disponibles".
 *
 * NOTA SOBRE CONTRASTE: La manipulación de contraste en React Native `Image`
 * es limitada. Aquí se simula un cambio de contraste usando `tintColor` o
 * simplemente un mensaje, ya que el control real requiere librerías nativas
 * o de procesamiento de imágenes (ej. `react-native-image-filter` o SVG).
 * La propiedad `tintColor` aquí aplicada es una simplificación visual.
 *
 * @param {MedicalImageViewerProps} props - Propiedades del visualizador de imágenes.
 * @returns {JSX.Element} Un componente de vista con la imagen y sus controles.
 */
const MedicalImageViewer: React.FC<MedicalImageViewerProps> = ({ imageUrl }) => {
  const [{ zoomLevel, contrastLevel }, { setZoomLevel, setContrastLevel }] = useImageViewer();

  // Escenario: Imagen inexistente o URL vacía/nula
  if (!imageUrl || imageUrl.trim() === '') {
    return (
      <View style={styles.noImageContainer}>
        <Text style={styles.noImageText}>No hay imágenes disponibles</Text>
      </View>
    );
  }

  // Estilos de transformación para zoom
  const imageTransformStyle = {
    transform: [{ scale: zoomLevel }],
  };

  // Estilos para simular contraste.
  // En iOS, colorFilter podría usarse para tintes, pero para contraste directo no es ideal.
  // En Android, tintColor puede aplicarse como un filtro.
  // Para una implementación real de contraste se requiere una librería de procesamiento de imágenes.
  const contrastTint = `rgba(0, 0, 0, ${1 - contrastLevel})`; // Ejemplo simple de oscurecimiento/aclaramiento

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Visualizador de Imágenes Médicas</Text>

      <View style={styles.imageWrapper}>
        <Image
          source={{ uri: imageUrl }}
          style={[
            styles.image,
            imageTransformStyle,
            { tintColor: Platform.OS === 'android' ? contrastTint : undefined }, // Aplicar tintColor solo en Android para simulación
          ]}
          resizeMode="contain"
          accessibilityLabel="Imagen médica"
        />
        {/* En iOS, para un contraste real, se necesitaría una capa superpuesta o una librería. */}
        {Platform.OS === 'ios' && (
          <View style={[styles.contrastOverlay, { opacity: 1 - contrastLevel }]} />
        )}
      </View>

      <View style={styles.controlsContainer}>
        <Slider
          label="Zoom"
          value={zoomLevel}
          onValueChange={setZoomLevel}
          minimumValue={0.5}
          maximumValue={3.0}
          step={0.1}
        />
        <Slider
          label="Contraste (simulado)"
          value={contrastLevel}
          onValueChange={setContrastLevel}
          minimumValue={0.5}
          maximumValue={2.0}
          step={0.1}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
    alignItems: 'center',
    padding: 10,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    color: colors.dark,
    marginTop: 10,
  },
  noImageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  noImageText: {
    fontSize: 18,
    color: colors.gray,
    textAlign: 'center',
  },
  imageWrapper: {
    width: width - 20, // Ancho de la pantalla menos padding
    height: width * 0.6, // Relación de aspecto para la imagen
    backgroundColor: colors.dark,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden', // Importante para que el zoom no se salga del contenedor
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.gray,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contrastOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'black', // Capa negra para simular el contraste en iOS
    opacity: 0, // Opacidad inicial
    pointerEvents: 'none', // Asegura que la capa no interfiera con los eventos táctiles subyacentes
  },
  controlsContainer: {
    width: '100%',
    paddingHorizontal: 10,
  },
});

export default MedicalImageViewer;
```

```typescript filename=src/screens/MedicalImageViewerScreen.tsx
// src/screens/MedicalImageViewerScreen.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import MedicalImageViewer from '../components/MedicalImageViewer/MedicalImageViewer';
import { imageService } from '../services/ImageService';
import { colors } from '../theme/colors';
import { MedicalImageViewerScreenParams } from '../types';

/**
 * @type {RootStackParamList}
 * Define los tipos de parámetros para las rutas de la aplicación.
 * Aquí solo incluimos la ruta para MedicalImageViewer.
 * (En una app real, esto estaría en un archivo de configuración de navegación global).
 */
type RootStackParamList = {
  MedicalImageViewer: MedicalImageViewerScreenParams;
};

/**
 * @type {MedicalImageViewerScreenRouteProp}
 * Tipo para la propiedad `route` de `MedicalImageViewerScreen`.
 */
type MedicalImageViewerScreenRouteProp = RouteProp<RootStackParamList, 'MedicalImageViewer'>;

/**
 * Pantalla para la visualización de imágenes médicas.
 * Recupera la URL de la imagen de los parámetros de navegación o la obtiene de un servicio.
 * Pasa la URL al componente `MedicalImageViewer`.
 *
 * @returns {JSX.Element} Un componente de vista que contiene el visualizador de imágenes.
 */
const MedicalImageViewerScreen: React.FC = () => {
  const route = useRoute<MedicalImageViewerScreenRouteProp>();
  const [imageUrl, setImageUrl] = useState<string | null | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchImage = async () => {
      setLoading(true);
      setError(null);
      try {
        // Primero, intentar obtener la URL de los parámetros de navegación
        const paramImageUrl = route.params?.imageUrl;

        if (paramImageUrl) {
          setImageUrl(paramImageUrl);
        } else {
          // Si no hay URL en params, simular una llamada al servicio
          // Aquí podríamos pasar un ID de paciente real
          console.log('No se encontró URL en params. Intentando obtener del servicio...');
          const fetchedUrl = await imageService.getMedicalImageUrl('patient123'); // Usar un ID de paciente de ejemplo
          setImageUrl(fetchedUrl);
        }
      } catch (err) {
        console.error('Error fetching image URL:', err);
        setError('Error al cargar la imagen. Inténtalo de nuevo más tarde.');
        setImageUrl(null); // Asegurar que imageUrl es null en caso de error
      } finally {
        setLoading(false);
      }
    };

    fetchImage();
  }, [route.params?.imageUrl]); // Dependencia para re-fetch si la URL de los params cambia

  if (loading) {
    return (
      <View style={styles.centeredContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando imagen...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centeredContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* El componente MedicalImageViewer maneja el caso de URL nula/vacía internamente */}
      <MedicalImageViewer imageUrl={imageUrl} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.light,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: colors.gray,
  },
  errorText: {
    fontSize: 16,
    color: colors.danger,
    textAlign: 'center',
    marginHorizontal: 20,
  },
});

export default MedicalImageViewerScreen;
```

```typescript filename=src/navigation/AppNavigator.tsx
// src/navigation/AppNavigator.tsx
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import MedicalImageViewerScreen from '../screens/MedicalImageViewerScreen';
import { MedicalImageViewerScreenParams } from '../types';
import { colors } from '../theme/colors';
import StyledButton from '../components/common/StyledButton'; // Importamos el botón para el ejemplo

/**
 * @type {RootStackParamList}
 * Define los tipos de parámetros para las rutas de la pila de navegación.
 * Esto asegura type-safety al navegar.
 */
export type RootStackParamList = {
  Home: undefined; // Una pantalla de inicio simple para el ejemplo
  MedicalImageViewer: MedicalImageViewerScreenParams;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

/**
 * Componente de la pantalla de Inicio de la aplicación.
 * Solo para propósitos de demostración, con un botón para navegar a la pantalla del visualizador.
 */
const HomeScreen: React.FC<any> = ({ navigation }) => {
  return (
    <View style={homeStyles.container}>
      <Text style={homeStyles.title}>MediCS App</Text>
      <StyledButton
        title="Ver Imagen Médica (Ej. Resonancia)"
        onPress={() =>
          navigation.navigate('MedicalImageViewer', {
            imageUrl: 'https://via.placeholder.com/600x400/0000FF/FFFFFF?text=MRI_Brain_Scan',
          })
        }
      />
      <StyledButton
        title="Ver Imagen Médica (Ej. Rayos X)"
        onPress={() =>
          navigation.navigate('MedicalImageViewer', {
            imageUrl: 'https://via.placeholder.com/600x400/FF0000/FFFFFF?text=XRay_Chest',
          })
        }
        style={{ backgroundColor: colors.success }}
      />
      <StyledButton
        title="Ver Imagen Médica (Sin URL)"
        onPress={() =>
          navigation.navigate('MedicalImageViewer', {
            imageUrl: null, // Simula una URL nula para probar el escenario "No hay imágenes disponibles"
          })
        }
        style={{ backgroundColor: colors.warning }}
        textStyle={{ color: colors.dark }}
      />
       <StyledButton
        title="Ver Imagen Médica (URL Vacía)"
        onPress={() =>
          navigation.navigate('MedicalImageViewer', {
            imageUrl: '', // Simula una URL vacía para probar el escenario "No hay imágenes disponibles"
          })
        }
        style={{ backgroundColor: colors.danger }}
      />
      <StyledButton
        title="Ver Imagen (Obtenida de Servicio)"
        onPress={() =>
          navigation.navigate('MedicalImageViewer', {
            // No pasamos imageUrl, la pantalla lo intentará obtener del servicio.
            // Para simular "no_image_patient" puedes comentar la línea de arriba y descomentar la de abajo
            // imageUrl: undefined
          })
        }
        style={{ backgroundColor: colors.info }}
      />
    </View>
  );
};

const homeStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.light,
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: colors.dark,
  },
});

/**
 * Componente principal del navegador de la aplicación.
 * Configura la pila de navegación usando `react-navigation`.
 * @returns {JSX.Element} Un contenedor de navegación con un stack de pantallas.
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.primary,
          },
          headerTintColor: colors.white,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: 'Inicio MediCS' }}
        />
        <Stack.Screen
          name="MedicalImageViewer"
          component={MedicalImageViewerScreen}
          options={{ title: 'Visualizador de Imágenes' }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
```

Para que este código funcione, asegúrate de tener instaladas las siguientes dependencias de `react-native`:
*   `@react-navigation/native`
*   `@react-navigation/native-stack`
*   `react-native-screens`
*   `react-native-safe-area-context`
*   `@react-native-community/slider` (Para el componente `Slider`)

Y sus respectivos `pod install` para iOS si aplica.

Con esto, tienes una arquitectura completa para la historia de usuario de visualización de imágenes médicas, siguiendo las mejores prácticas y los requisitos especificados.