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
