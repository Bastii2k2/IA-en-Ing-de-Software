// src/screens/PatientEditScreen.tsx
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { patientService } from '../services/PatientService';
import { Patient, PatientFormData } from '../types/patient';
import { LoadingIndicator } from '../components/LoadingIndicator';
import { ErrorMessage } from '../components/ErrorMessage';
import { SuccessMessage } from '../components/SuccessMessage';
import { PatientForm } from '../components/PatientForm';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../components/Button'; // Importamos Button para los botones de rol de prueba

// Define los parámetros de la pila de navegación
type RootStackParamList = {
  PatientEdit: { patientId: string };
  // Otras pantallas...
};

type PatientEditScreenProps = StackScreenProps<RootStackParamList, 'PatientEdit'>;

/**
 * Pantalla para editar la información de un paciente existente.
 * Carga los datos, utiliza el `PatientForm` para la edición y actualiza los datos.
 * Maneja permisos y muestra retroalimentación al usuario.
 */
export const PatientEditScreen: React.FC<PatientEditScreenProps> = ({ route, navigation }) => {
  const { patientId } = route.params; // Obtenemos el ID del paciente de los parámetros de navegación

  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Hook para la gestión de autenticación y permisos
  const { currentUserRole, isLoadingAuth, hasPermission, login, logout } = useAuth();

  // Valores iniciales para el formulario, se usan si el paciente aún no se ha cargado
  const initialFormValues: PatientFormData = {
    name: '',
    dob: '',
    medicalHistory: '',
  };

  /**
   * Carga los datos del paciente cuando la pantalla se monta o el ID del paciente cambia.
   */
  useEffect(() => {
    const fetchPatient = async () => {
      setIsLoading(true);
      setError(null);
      setSuccessMessage(null);
      try {
        const fetchedPatient = await patientService.getPatientById(patientId);
        setPatient(fetchedPatient);
      } catch (err) {
        console.error('Error al cargar paciente:', err);
        setError('No se pudo cargar la información del paciente. Por favor, intente de nuevo.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchPatient();

    // Inicializar pacientes de prueba si no existen (solo para demostración)
    patientService.seedPatients();
  }, [patientId]);

  /**
   * Maneja el envío del formulario para actualizar el paciente.
   * Incluye la verificación de permisos.
   * @param updatedData Los datos del formulario que se van a guardar.
   */
  const handleUpdatePatient = async (updatedData: PatientFormData) => {
    setIsUpdating(true);
    setError(null);
    setSuccessMessage(null);

    // Gherkin: "Intento de actualización sin permisos"
    if (!hasPermission('update_patient')) {
      setError('Acceso denegado: No tienes permisos para actualizar la información del paciente.');
      setIsUpdating(false);
      return;
    }

    try {
      if (!patientId) {
        throw new Error('ID de paciente no disponible para la actualización.');
      }
      await patientService.updatePatient(patientId, updatedData);
      setSuccessMessage('Información del paciente actualizada exitosamente.');
      // Opcional: navegar a la pantalla de detalles del paciente o a una lista
      // navigation.goBack();
    } catch (err: any) {
      console.error('Error al actualizar paciente:', err);
      setError(`Error al guardar los cambios: ${err.message || 'Error desconocido'}`);
    } finally {
      setIsUpdating(false);
    }
  };

  // Muestra un indicador de carga mientras se cargan los datos del paciente o la autenticación
  if (isLoading || isLoadingAuth) {
    return <LoadingIndicator message="Cargando datos del paciente..." />;
  }

  // Si hay un error y no hay paciente cargado, muestra el error
  if (error && !patient) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage message={error} />
        {/* Botones para cambiar de rol para probar el escenario de permisos */}
        <View style={styles.roleButtons}>
          <Button title="Login como Admin" onPress={() => login('admin')} disabled={currentUserRole === 'admin'} />
          <Button title="Login como Invitado" onPress={() => login('guest')} disabled={currentUserRole === 'guest'} variant="secondary" />
        </View>
      </View>
    );
  }

  // Si el paciente no se encontró o hubo un error fatal
  if (!patient) {
    return (
      <View style={styles.centerContainer}>
        <ErrorMessage message="Paciente no encontrado o hubo un problema al cargar. Contacte a soporte." />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        {/* Mostrar el rol actual del usuario para fines de depuración */}
        <Text style={styles.roleText}>Rol Actual: {currentUserRole || 'Ninguno'}</Text>
        <View style={styles.roleButtons}>
          <Button title="Login como Admin" onPress={() => login('admin')} disabled={currentUserRole === 'admin'} />
          <Button title="Login como Invitado" onPress={() => login('guest')} disabled={currentUserRole === 'guest'} variant="secondary" />
        </View>

        {successMessage && <SuccessMessage message={successMessage} />}
        {error && <ErrorMessage message={error} />}

        {/* El formulario del paciente, pre-rellenado con los datos existentes */}
        <PatientForm
          initialValues={{
            name: patient.name,
            dob: patient.dob,
            medicalHistory: patient.medicalHistory,
          }}
          onSubmit={handleUpdatePatient}
          submitButtonText="Guardar Cambios"
          isSubmitting={isUpdating}
        />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#eef2f7',
  },
  container: {
    flex: 1,
    padding: 10,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  roleText: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#333',
  },
  roleButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginVertical: 15,
  },
});
