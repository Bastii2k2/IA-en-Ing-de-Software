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
