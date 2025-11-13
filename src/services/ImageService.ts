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
