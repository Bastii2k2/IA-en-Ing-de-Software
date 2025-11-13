// src/components/common/SearchResultList.tsx

import React from 'react';
import { FlatList, View, StyleSheet, ListRenderItemInfo } from 'react-native';

/**
 * @interface SearchResultListProps
 * Propiedades para el componente SearchResultList.
 * @template T El tipo de dato para cada elemento en la lista.
 */
interface SearchResultListProps<T> {
  data: T[]; // Array de datos a renderizar
  renderItem: ({ item, index }: ListRenderItemInfo<T>) => React.ReactElement; // Función para renderizar cada item
  keyExtractor: (item: T, index: number) => string; // Función para extraer una clave única por item
  emptyMessageComponent?: React.ReactElement; // Componente a mostrar cuando la lista está vacía
}

/**
 * @function SearchResultList
 * Un componente genérico para renderizar listas de resultados.
 * Envuelve un FlatList y permite mostrar un componente personalizado
 * cuando la lista de datos está vacía.
 *
 * @template T Tipo de los elementos de la lista.
 * @param {SearchResultListProps<T>} props Las propiedades del componente.
 * @returns {JSX.Element} Un componente FlatList o el mensaje de lista vacía.
 */
function SearchResultList<T>({ data, renderItem, keyExtractor, emptyMessageComponent }: SearchResultListProps<T>): React.ReactElement {
  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListEmptyComponent={emptyMessageComponent} // Muestra este componente si 'data' está vacío
        contentContainerStyle={data.length === 0 && styles.emptyListContainer} // Estilos para el contenedor cuando la lista está vacía
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, // Permite que la lista ocupe el espacio disponible
    width: '100%',
  },
  emptyListContainer: {
    flexGrow: 1, // Permite que el contenido vacío ocupe todo el espacio vertical
    justifyContent: 'center', // Centra el mensaje de lista vacía
    alignItems: 'center',
  },
});

export default SearchResultList;
