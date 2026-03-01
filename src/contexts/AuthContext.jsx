"use client";
import { createContext, useState, useEffect, useContext, useCallback } from "react";
import Cookies from "js-cookie";
import { getMe } from "@/services/auth.service";

// Cria o contexto vazio
export const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [permissions, setPermissions] = useState([]);
  const [isReady, setIsReady] = useState(false);

  // 1. useCallback permite que a gente chame essa função de fora (ex: na tela de Permissões)
  const fetchUserData = useCallback(async () => {
    const token = Cookies.get("token");

    if (token) {
      try {
        const data = await getMe();
        setUser(data); // Salva os dados do usuário (incluindo usu_acesso)
        setPermissions(data.permissoes || []);
      } catch (error) {
        console.error("Erro ao buscar dados no /auth/me", error);
      }
    }
    setIsReady(true);
  }, []);

  // 2. useEffect blindado contra o aviso de "cascading renders" do linter
  useEffect(() => {
    const loadUser = async () => {
      await fetchUserData();
    };

    loadUser();
  }, [fetchUserData]);

  // Hook interno para checar se o usuário tem uma permissão específica
  const hasPermission = (permissionName) => {
    return permissions.includes(permissionName);
  };

  return (
    // 3. Exportamos tudo que o sistema precisa, incluindo o refreshSession!
    <AuthContext.Provider 
        value={{ 
            user, 
            permissions, 
            hasPermission, 
            isReady, 
            refreshSession: fetchUserData // Apelidamos a função para ficar mais semântico
        }}
    >
      {/* Só mostra o site quando terminar de carregar os dados */}
      {isReady ? children : null} 
    </AuthContext.Provider>
  );
}

// Hook personalizado para você usar nas suas telas
export const useAuthContext = () => useContext(AuthContext);