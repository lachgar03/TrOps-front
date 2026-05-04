import { create } from 'zustand';
import { jwtDecode } from 'jwt-decode';
import type { UserPayload } from '../types/auth.types';

interface AuthState {
  token: string | null;
  isAuthenticated: boolean;
  user: UserPayload | null;
  login: (token: string) => void;
  register: (token: string) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => {
  // Récupération du token au chargement de l'application
  const storedToken = localStorage.getItem('token');
  let initialUser: UserPayload | null = null;
  
  if (storedToken) {
    try {
      initialUser = jwtDecode<UserPayload>(storedToken);
      // Optionnel: vérifier si le token est expiré (exp * 1000 < Date.now())
      if (initialUser.exp && initialUser.exp * 1000 < Date.now()) {
        console.warn("Le token est expiré");
        initialUser = null;
        localStorage.removeItem('token');
      }
    } catch (error) {
      console.error("Token JWT invalide", error);
      localStorage.removeItem('token');
    }
  }

  // L'utilisateur est authentifié s'il a un token valide et que les infos ont bien été décodées
  const hasValidSession = !!(storedToken && initialUser);

  return {
    token: hasValidSession ? storedToken : null,
    isAuthenticated: hasValidSession,
    user: initialUser,

    login: (token: string) => {
      localStorage.setItem('token', token);
      try {
        const decodedUser = jwtDecode<UserPayload>(token);
        set({
          token,
          isAuthenticated: true,
          user: decodedUser,
        });
      } catch (error) {
        console.error("Erreur lors du décodage du token JWT après login", error);
      }
    },

    register: (token: string) => {
      localStorage.setItem('token', token);
      try {
        const decodedUser = jwtDecode<UserPayload>(token);
        set({
          token,
          isAuthenticated: true,
          user: decodedUser,
        });
      } catch (error) {
        console.error("Erreur lors du décodage du token JWT après inscription", error);
      }
    },

    logout: () => {
      localStorage.removeItem('token');
      set({
        token: null,
        isAuthenticated: false,
        user: null,
      });
    },
  };
});
