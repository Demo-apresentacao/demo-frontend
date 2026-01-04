import api from "./api"; 

function getLoggedUserId() {
  if (typeof window === "undefined") return null;

  const userStr = localStorage.getItem("user");

  if (!userStr) {
      console.error("ERRO: LocalStorage vazio ou chave 'user' não existe.");
      return null;
  }

  try {
      const userObj = JSON.parse(userStr);
  

      return userObj.usu_id;
  } catch (e) {
      console.error("ERRO: Falha ao fazer JSON.parse do usuário", e);
      return null;
  }
}

export const getMyProfile = async () => {
  
  const id = getLoggedUserId();
  
  if (!id) {
      console.error("ERRO: ID não encontrado, abortando requisição.");
      throw new Error("ID não encontrado");
  }

  try {
      const response = await api.get(`/users/${id}`);
      return response.data.data;
  } catch (error) {
      console.error("ERRO NA API:", error);
      throw error;
  }
};

export const updateMyProfile = async (data) => {
  const id = getLoggedUserId();
  const response = await api.patch(`/users/${id}`, data);
  return response.data;
};