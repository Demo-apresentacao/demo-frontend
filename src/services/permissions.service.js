import api from "./api";

// Busca TODAS as permissões do sistema
export async function getAllPermissions() {
  const { data } = await api.get("/permissions");
  return data; // Ex: [{ per_chave: 'usuarios.listar', per_descricao: '...' }, ...]
}

// Busca as permissões de um usuário específico
export async function getUserPermissions(userId) {
  const { data } = await api.get(`/users/${userId}/permissions`);
  // O ideal é que retorne um array de strings: ['usuarios.listar', 'veiculos.criar']
  return data; 
}

// Salva as novas permissões do usuário
export async function updateUserPermissions(userId, permissionsArray) {
  const { data } = await api.put(`/users/${userId}/permissions`, {
    permissions: permissionsArray
  });
  return data;
}