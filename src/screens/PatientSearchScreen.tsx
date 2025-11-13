// src/screens/PatientSearchScreen.tsx

import React from 'react';
import { View, StyleSheet, Text, ActivityIndicator, Keyboard } from 'react-native';
import { usePatientSearch } from '../hooks/usePatientSearch';
import StyledInput from '../components/common/StyledInput';
import Button from '../components/common/Button';
import SearchResultList from '../components/common/SearchResultList';
import EmptyStateMessage from '../components/common/EmptyStateMessage';
import PatientListItem from '../components/patients/PatientListItem';
import { Patient } from '../types';

/**
 * @function PatientSearchScreen
 * Pantalla principal para buscar y filtrar pacientes.
 * Utiliza el hook `usePatientSearch` para la lógica y componentes UI reutilizables.
 */
const PatientSearchScreen: React.FC = () => {
  // Obtenemos los estados y funciones de nuestro hook personalizado
  const {
    searchTerm,
    setSearchTerm,
    searchResults,
    isLoading,
    error,
    handleSearch,
    clearSearch,
  } = usePatientSearch();

  /**
   * Manejador para el botón de búsqueda.
   * Cierra el teclado antes de iniciar la búsqueda.
   */
  const onSearchPress = () => {
    Keyboard.dismiss(); // Ocultar el teclado al presionar buscar
    handleSearch();
  };

  /**
   * Función para renderizar un item individual de paciente en la lista.
   * @param {Object} item El objeto paciente.
   * @returns {JSX.Element} Un componente PatientListItem.
   */
  const renderPatientItem = ({ item }: { item: Patient }) => (
    <PatientListItem
      patient={item}
      // onPress={() => console.log('Paciente seleccionado:', item.name)}
      // Podríamos navegar a una pantalla de detalles del paciente aquí
    />
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBarContainer}>
        <StyledInput
          label="Buscar paciente"
          placeholder="Nombre o apellido del paciente"
          value={searchTerm}
          onChangeText={setSearchTerm}
          returnKeyType="search" // Cambia el botón del teclado a "Buscar"
          onSubmitEditing={onSearchPress} // Ejecuta la búsqueda al presionar "Buscar" en el teclado
          style={styles.searchInput}
        />
        <Button
          title="Buscar"
          onPress={onSearchPress}
          isLoading={isLoading}
          style={styles.searchButton}
          disabled={searchTerm.trim() === ''} // Deshabilita el botón si el término está vacío
        />
      </View>

      {/* Muestra un indicador de carga mientras se buscan resultados */}
      {isLoading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Buscando pacientes...</Text>
        </View>
      )}

      {/* Muestra mensajes de error si existen */}
      {error && <EmptyStateMessage message={error} />}

      {/* Muestra el mensaje de "No se encontraron resultados" si la búsqueda terminó, no hay resultados y no hay error */}
      {!isLoading && !error && searchTerm.trim() !== '' && searchResults.length === 0 && (
        <EmptyStateMessage message="No se encontraron resultados para su búsqueda." />
      )}

      {/* Muestra la lista de resultados si hay pacientes y no hay errores ni carga */}
      {!isLoading && !error && searchResults.length > 0 && (
        <SearchResultList
          data={searchResults}
          renderItem={renderPatientItem}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 20,
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  searchInput: {
    flex: 1, // Permite que el input ocupe la mayor parte del espacio
    marginRight: 10,
    marginBottom: 0, // Quitamos el margen inferior para alineación en fila
  },
  searchButton: {
    paddingVertical: 12, // Ajustamos el padding para que coincida con la altura del input
    paddingHorizontal: 15,
    minHeight: 45, // Aseguramos la altura mínima
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default PatientSearchScreen;
