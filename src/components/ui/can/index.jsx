"use client";
import { useAuthContext } from "@/contexts/AuthContext"; // Ajuste o caminho se necessário

export function Can({ perform, fallback = null, children }) {
  const { hasPermission, isReady } = useAuthContext();

  // Opcional: enquanto carrega as permissões, não renderiza o botão para não dar "falsos positivos"
  if (!isReady) return null;

  // Se o usuário não tiver a permissão exigida, retorna null (esconde o botão)
  if (!hasPermission(perform)) {
    return fallback; // <-- Aqui está a mágica!
  }

  // Se tiver, mostra o conteúdo normalmente
  return <>{children}</>;
}