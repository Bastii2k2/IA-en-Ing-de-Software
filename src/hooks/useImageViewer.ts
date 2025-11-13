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
