// App.tsx

import React from 'react';
import AppNavigator from './src/navigation/AppNavigator';

/**
 * @function App
 * @description Componente raíz de la aplicación React Native.
 *              Renderiza el navegador principal de la aplicación.
 * @returns {JSX.Element} El componente AppNavigator.
 */
const App: React.FC = () => {
  return <AppNavigator />;
};

export default App;
