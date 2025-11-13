// src/App.tsx

import 'react-native-gesture-handler'; // Importación requerida por React Navigation
import React from 'react';
import AppNavigator from './navigation/AppNavigator';

/**
 * Componente raíz de la aplicación.
 * Renderiza el AppNavigator que contiene toda la estructura de navegación.
 */
const App: React.FC = () => {
  return (
    <AppNavigator />
  );
};

export default App;
