import api from "@/services/api";

export async function login(email, senha) {
  
  const { data } = await api.post("/auth/login", {
    usu_email: email, 
    usu_senha: senha,
  });

  return data;
}

// Adicione isso junto com a sua função login()
export async function getMe() {
  const { data } = await api.get("/auth/me");
  return data;
}