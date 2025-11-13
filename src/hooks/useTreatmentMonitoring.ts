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
