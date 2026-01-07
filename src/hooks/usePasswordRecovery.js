import { useState } from 'react';
import { useRouter } from 'next/navigation'; // Importação correta para Next.js (App Router)
import { forgotPassword, resetPassword } from '../services/password.service';

export const usePasswordRecovery = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  const router = useRouter(); // Instância do router do Next.js

  /**
   * Função para solicitar o e-mail de recuperação
   * @param {string} email 
   */
  const requestRecovery = async (email) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await forgotPassword(email);
      setSuccessMessage('Se o e-mail estiver cadastrado, você receberá um link em instantes.');
    } catch (err) {
      // Tratamento seguro: mesmo que dê erro 404 (usuário não existe),
      // às vezes é segurança não dizer "E-mail não existe".
      // Mas se quiser mostrar o erro real do backend:
      const msg = err.response?.data?.message || 'Erro ao tentar enviar e-mail.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  /**
   * Função para efetivar a troca da senha
   * @param {string} token - Token vindo da URL
   * @param {string} newPassword - Nova senha digitada
   */
  const performReset = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      await resetPassword(token, newPassword);
      setSuccessMessage('Senha alterada com sucesso! Redirecionando para o login...');
      
      // Redireciona automaticamente após 3 segundos
      setTimeout(() => {
        router.push('/auth/login'); // Método push do Next.js
      }, 3000);

    } catch (err) {
      const msg = err.response?.data?.message || 'Falha ao redefinir senha. O link pode ter expirado.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  // Função utilitária para limpar estados (caso o usuário tente de novo)
  const clearState = () => {
    setError(null);
    setSuccessMessage(null);
  };

  return {
    loading,
    error,
    successMessage,
    requestRecovery,
    performReset,
    clearState
  };
};