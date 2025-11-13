// src/hooks/usePatientSearch.ts

import { useState, useEffect, useCallback } from 'react';
import { Patient } from '../types';
import { patientService } from '../services/PatientService';

/**
 * @interface UsePatientSearch
 * Define la interfaz para el valor retornado por el hook usePatientSearch.
 */
interface UsePatientSearch {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  searchResults: Patient[];
  isLoading: boolean;
  error: string | null;
  handleSearch: () => Promise<void>;
  clearSearch: () => void; // Para limpiar resultados y término
}

/**
 * @function usePatientSearch
 * Hook personalizado para manejar la lógica de búsqueda de pacientes.
 * Encapsula el estado del término de búsqueda, los resultados, el estado de carga y errores.
 *
 * @returns {UsePatientSearch} Un objeto con el estado y las funciones para la búsqueda de pacientes.
 */
export const usePatientSearch = (): UsePatientSearch => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Patient[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Inicializa los pacientes en el servicio al montar el hook
  useEffect(() => {
    patientService.initPatients().catch(err => {
      console.error("Error initializing patients:", err);
      setError("No se pudieron cargar los datos iniciales de pacientes.");
    });
  }, []);

  /**
   * Ejecuta la búsqueda de pacientes utilizando el PatientService.
   * Actualiza los estados de carga, resultados y errores.
   */
  const handleSearch = useCallback(async () => {
    if (searchTerm.trim() === '') {
      setSearchResults([]); // Limpiar resultados si el término de búsqueda está vacío
      return;
    }

    setIsLoading(true);
    setError(null); // Limpiar errores previos
    try {
      const results = await patientService.searchPatients(searchTerm);
      setSearchResults(results);
    } catch (e) {
      console.error('Error al buscar pacientes:', e);
      setError('Ocurrió un error al buscar pacientes. Inténtalo de nuevo.');
      setSearchResults([]); // Limpiar resultados en caso de error
    } finally {
      setIsLoading(false);
    }
  }, [searchTerm]);

  /**
   * Limpia el término de búsqueda y los resultados.
   */
  const clearSearch = useCallback(() => {
    setSearchTerm('');
    setSearchResults([]);
    setError(null);
  }, []);

  return {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    error,
    handleSearch,
    clearSearch,
  };
};
