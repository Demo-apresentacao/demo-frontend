"use client";
import { createContext, useState, useEffect, useContext } from "react";
import Cookies from "js-cookie";
import { getMe } from "@/services/auth.service";

// Cria o contexto vazio
export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [permissions, setPermissions] = useState([]);
  const [isReady, setIsReady] = useState(false); // Para evitar piscar a tela antes de carregar

  useEffect(() => {
    async function fetchUserData() {
      const token = Cookies.get("token");

      if (token) {
        try {
          const data = await getMe();
          // Ajuste "data.permissoes" para o nome exato que seu backend retorna
          setPermissions(data.permissoes || []);
        } catch (error) {
          console.error("Erro ao buscar permissões no /auth/me", error);
        }
      }
      setIsReady(true);
    }

    fetchUserData();
  }, []); // Array vazio garante que só roda 1x quando a aplicação carrega

  // Hook interno para checar a permissão
  const hasPermission = (permissionName) => {
    return permissions.includes(permissionName);
  };

  return (
    <AuthContext.Provider value={{ permissions, hasPermission, isReady }}>
      {/* Só mostra o site quando terminar de carregar as permissões */}
      {isReady ? children : null} 
    </AuthContext.Provider>
  );
}

// Hook personalizado para você usar nas suas telas
export const useAuthContext = () => useContext(AuthContext);