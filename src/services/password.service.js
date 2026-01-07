import api from "@/services/api";

export async function forgotPassword(email) {
  const response = await api.post('/auth/password/forgot', { 
    usu_email: email });
  return response.data;
}

export async function resetPassword(token, password) {
  // Nota: O backend espera o token na URL e a senha no corpo (body)
  const response = await api.post(`/auth/password/reset/${token}`, { 
    usu_senha: password });
  return response.data;
}