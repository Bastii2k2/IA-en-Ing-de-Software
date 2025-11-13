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
