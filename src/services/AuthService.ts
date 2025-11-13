// src/services/AuthService.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

type UserRole = 'admin' | 'guest' | null;

const CURRENT_USER_ROLE_KEY = 'currentUserRole';

/**
 * @class AuthService
 * Servicio para simular la gestión de autenticación y roles de usuario.
 * Utiliza AsyncStorage para "persistir" el rol del usuario entre sesiones.
 */
class AuthService {
  private currentUserRole: UserRole = null;

  constructor() {
    this.loadCurrentUserRole(); // Carga el rol al inicializar el servicio
  }

  /**
   * Carga el rol del usuario desde AsyncStorage.
   * Esto simula que el rol persiste entre las aperturas de la app.
   */
  private async loadCurrentUserRole() {
    try {
      const storedRole = await AsyncStorage.getItem(CURRENT_USER_ROLE_KEY);
      if (storedRole === 'admin' || storedRole === 'guest') {
        this.currentUserRole = storedRole;
        console.log('AuthService: Rol cargado:', this.currentUserRole);
      } else {
        this.currentUserRole = 'guest'; // Rol por defecto si no hay nada guardado o es inválido
        await AsyncStorage.setItem(CURRENT_USER_ROLE_KEY, 'guest');
        console.log('AuthService: Rol por defecto establecido como "guest".');
      }
    } catch (error) {
      console.error('Error al cargar el rol del usuario desde AsyncStorage:', error);
      this.currentUserRole = 'guest'; // Fallback en caso de error
    }
  }

  /**
   * Establece el rol del usuario actual y lo guarda en AsyncStorage.
   * @param role El rol a establecer ('admin' o 'guest').
   */
  public async login(role: 'admin' | 'guest') {
    this.currentUserRole = role;
    await AsyncStorage.setItem(CURRENT_USER_ROLE_KEY, role);
    console.log('AuthService: Usuario loggeado como:', role);
  }

  /**
   * Cierra la sesión del usuario, estableciendo el rol a nulo y eliminándolo de AsyncStorage.
   */
  public async logout() {
    this.currentUserRole = null;
    await AsyncStorage.removeItem(CURRENT_USER_ROLE_KEY);
    console.log('AuthService: Sesión cerrada.');
  }

  /**
   * Obtiene el rol del usuario actual.
   * @returns El rol del usuario ('admin', 'guest' o null).
   */
  public getCurrentUserRole(): UserRole {
    return this.currentUserRole;
  }

  /**
   * Verifica si el usuario actual tiene un permiso específico.
   * Esto simula la lógica de autorización.
   * @param permission El permiso a verificar (ej: 'update_patient', 'view_patient').
   * @returns `true` si el usuario tiene el permiso, `false` en caso contrario.
   */
  public hasPermission(permission: 'update_patient' | 'view_patient'): boolean {
    // Para esta HU, solo el 'admin' puede 'update_patient'.
    // Otros permisos pueden ser añadidos aquí.
    if (permission === 'update_patient') {
      return this.currentUserRole === 'admin';
    }
    // Por defecto, permitir ver pacientes a todos
    if (permission === 'view_patient') {
      return this.currentUserRole === 'admin' || this.currentUserRole === 'guest';
    }
    return false;
  }
}

// Exporta una instancia única del servicio para usarlo en toda la aplicación (Singleton)
export const authService = new AuthService();
