// src/navigation/AppNavigator.tsx

import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import MedicationNotificationScreen from '../screens/MedicationNotificationScreen';

// Define los parámetros para las rutas de navegación.
// En este caso, MedicationNotificationScreen no requiere parámetros.
export type RootStackParamList = {
  MedicationNotification: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

/**
 * Componente principal del navegador de la aplicación.
 * Utiliza un Stack Navigator para gestionar las pantallas.
 */
const AppNavigator: React.FC = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="MedicationNotification">
        <Stack.Screen
          name="MedicationNotification"
          component={MedicationNotificationScreen}
          options={{ title: 'Alertas de Medicación' }} // Título en la barra superior
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
