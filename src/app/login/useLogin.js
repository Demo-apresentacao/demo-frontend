import { login } from "@/services/auth.service";
import Swal from "sweetalert2";
import Cookies from "js-cookie"; // Importação necessária

export function useLogin() {

  async function handleLogin(email, senha) {
    try {
      const response = await login(email, senha);

      console.log("LOGIN RESPONSE:", response);

      // Verificação de sucesso baseada no seu controller
      if (response.status !== "success") {
        throw new Error("Login inválido");
      }

      const usuario = response.data;
      const userRole = usuario.usu_acesso ? "admin" : "user";

      console.log("USUÁRIO:", usuario);

      // 1. SALVAR NO COOKIE (Para o Middleware ler)
      // Definimos o cookie no domínio atual (Vercel)
      // expires: 1 significa que o cookie dura 1 dia
      Cookies.set("logged", "true", { expires: 1, path: "/" });
      Cookies.set("role", userRole, { expires: 1, path: "/" });

      // 2. SALVAR NO LOCALSTORAGE (Para persistência de dados do perfil)
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: usuario.usu_id,
          nome: usuario.usu_nome,
          acesso: usuario.usu_acesso,
        })
      );

      // 3. REDIRECIONAMENTO
      // ATENÇÃO: Verifique se a rota é "/user" ou "/usuario" para bater com o Middleware
      const redirectPath = userRole === "admin" ? "/admin" : "/user";

      console.log("REDIRECT PARA:", redirectPath);

      // Usar window.location.href garante que o middleware intercepte a nova requisição com os cookies frescos
      window.location.href = redirectPath;

    } catch (error) {
      console.error("ERRO LOGIN:", error);

      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "E-mail ou senha inválidos ou erro na conexão com o servidor.",
      });
    }
  }

  return { handleLogin };
}