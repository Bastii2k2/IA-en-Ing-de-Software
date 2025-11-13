// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import { authService } from '../services/AuthService';

type UserRole = 'admin' | 'guest' | null;

/**
 * Hook personalizado para acceder fácilmente a la información de autenticación y permisos.
 * Proporciona el rol del usuario actual y una función para verificar permisos.
 */
export const useAuth = () => {
  const [currentUserRole, setCurrentUserRole] = useState<UserRole>(authService.getCurrentUserRole());
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    const loadRole = async () => {
      // Forzamos la carga inicial del rol si no está ya disponible
      await authService['loadCurrentUserRole'](); // Acceso a método privado para asegurar la carga
      setCurrentUserRole(authService.getCurrentUserRole());
      setIsLoadingAuth(false);
    };

    loadRole();

    // En un entorno real, aquí se podría suscribir a cambios en el estado de autenticación
    // Por simplicidad, para este ejemplo, re-cargamos una vez.
  }, []);

  const hasPermission = (permission: 'update_patient' | 'view_patient') => {
    return authService.hasPermission(permission);
  };

  const login = async (role: 'admin' | 'guest') => {
    await authService.login(role);
    setCurrentUserRole(authService.getCurrentUserRole());
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUserRole(null);
  };

  return {
    currentUserRole,
    isLoadingAuth,
    hasPermission,
    login,
    logout,
  };
};
