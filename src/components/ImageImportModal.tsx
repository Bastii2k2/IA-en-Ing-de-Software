// src/components/ImageImportModal.tsx
/**
 * @file Componente modal para la importación de imágenes médicas.
 * Permite seleccionar un archivo (simulado) y lo importa a través de ImagingService.
 */
import React, { useState, useEffect } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import StyledButton from './StyledButton';
import { useImagePicker } from '../hooks/useImagePicker';
import ImagingService from '../services/ImagingService';
import PatientService from '../services/PatientService'; // Para obtener el patientId

interface ImageImportModalProps {
  isVisible: boolean;
  onClose: () => void;
  patientId: string; // El ID del paciente al que se asociará la imagen
}

const ImageImportModal: React.FC<ImageImportModalProps> = ({ isVisible, onClose, patientId }) => {
  const { selectedFile, pickImage, resetSelection } = useImagePicker();
  const [isImporting, setIsImporting] = useState(false);

  // Resetea la selección de archivo cuando el modal se abre/cierra
  useEffect(() => {
    if (isVisible) {
      resetSelection(); // Limpia cualquier selección anterior al abrir
    }
  }, [isVisible, resetSelection]);

  /**
   * Maneja el evento de importación del archivo.
   * Utiliza el ImagingService para procesar la imagen seleccionada.
   */
  const handleImport = async () => {
    if (!selectedFile) {
      return; // No hay archivo para importar
    }
    setIsImporting(true);
    try {
      // Llamamos al servicio de imágenes para importar el archivo
      const success = await ImagingService.importImage(selectedFile, patientId);
      if (success) {
        onClose(); // Cerrar el modal solo si la importación fue exitosa
      }
    } catch (error) {
      console.error("Error al importar la imagen:", error);
      // El ImagingService ya maneja las alertas, pero aquí se podría añadir un fallback
    } finally {
      setIsImporting(false);
      resetSelection(); // Limpiar la selección después de intentar la importación
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Importar Imagen Médica</Text>

          {/* Botón para simular la selección de archivo */}
          <StyledButton
            title={selectedFile ? "Cambiar Archivo" : "Seleccionar Archivo"}
            onPress={pickImage}
            style={styles.selectButton}
            disabled={isImporting}
          />

          {/* Muestra información del archivo seleccionado */}
          {selectedFile && (
            <View style={styles.fileInfoContainer}>
              <Text style={styles.fileInfoText}>Archivo: {selectedFile.name}</Text>
              <Text style={styles.fileInfoText}>Tipo: {selectedFile.type}</Text>
            </View>
          )}

          {/* Botón para iniciar la importación */}
          <StyledButton
            title="Importar"
            onPress={handleImport}
            isLoading={isImporting}
            disabled={!selectedFile || isImporting}
            style={styles.importButton}
          />

          {/* Botón para cerrar el modal */}
          <Pressable
            style={[styles.button, styles.buttonClose]}
            onPress={onClose}
            disabled={isImporting}
          >
            <Text style={styles.textStyle}>Cerrar</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)', // Fondo oscuro semitransparente
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '85%', // Ajustar ancho para adaptarse a diferentes pantallas
    maxWidth: 400,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  selectButton: {
    backgroundColor: '#28a745', // Un color verde para seleccionar
    marginBottom: 15,
  },
  fileInfoContainer: {
    backgroundColor: '#f8f9fa',
    padding: 10,
    borderRadius: 8,
    width: '100%',
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  fileInfoText: {
    fontSize: 14,
    color: '#555',
    marginBottom: 3,
  },
  importButton: {
    backgroundColor: '#007bff', // Color azul para importar
    marginBottom: 15,
  },
  button: {
    borderRadius: 8,
    padding: 10,
    elevation: 2,
    minWidth: 100,
    alignItems: 'center',
  },
  buttonClose: {
    backgroundColor: '#dc3545', // Color rojo para cerrar
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default ImageImportModal;
