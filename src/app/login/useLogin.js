import { useRouter } from "next/navigation";
import { login } from "@/services/auth.service";
import Swal from "sweetalert2";

export function useLogin() {
  const router = useRouter();

  async function handleLogin(email, senha) {
    try {
      const response = await login(email, senha);

      if (response.sucesso) {
        const usuario = response.dados;

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: usuario.usu_id,
            nome: usuario.usu_nome,
            acesso: usuario.usu_acesso,
          })
        );

        router.push(
          usuario.usu_acesso === 1 ? "/admin" : "/usuario"
        );
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "Credenciais inválidas",
      });
    }
  }

  return { handleLogin };
}
