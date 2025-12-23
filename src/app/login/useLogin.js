// import { useRouter } from "next/navigation";
// import { login } from "@/services/auth.service";
// import Swal from "sweetalert2";

// export function useLogin() {
//   const router = useRouter();

//   async function handleLogin(email, senha) {
//     try {
//       const response = await login(email, senha);
  
//       console.log("LOGIN RESPONSE:", response);
  
//       if (response.status === "success") {
//         const usuario = response.data;
  
//         console.log("USUÁRIO:", usuario);
//         console.log("REDIRECT PARA:", usuario.usu_acesso ? "/admin" : "/usuario");
  
//         router.push(
//           usuario.usu_acesso ? "/admin" : "/usuario"
//         );
//       } else {
//         console.log("STATUS DIFERENTE DE SUCCESS");
//       }
//     } catch (error) {
//       console.error("ERRO LOGIN:", error);
  
//       Swal.fire({
//         icon: "error",
//         title: "Erro",
//         text: "Credenciais inválidas",
//       });
//     }
//   }

//   return { handleLogin };
// }


import { login } from "@/services/auth.service";
import Swal from "sweetalert2";

export function useLogin() {

  async function handleLogin(email, senha) {
    try {
      const response = await login(email, senha);

      console.log("LOGIN RESPONSE:", response);

      if (response.status !== "success") {
        throw new Error("Login inválido");
      }

      const usuario = response.data;

      console.log("USUÁRIO:", usuario);

      // (Opcional) salvar dados básicos no localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          id: usuario.usu_id,
          nome: usuario.usu_nome,
          acesso: usuario.usu_acesso,
        })
      );

      // 🔥 REDIRECIONAMENTO HARD (OBRIGATÓRIO COM MIDDLEWARE)
      const redirectPath = usuario.usu_acesso ? "/admin" : "/usuario";

      console.log("REDIRECT PARA:", redirectPath);

      window.location.href = redirectPath;

    } catch (error) {
      console.error("ERRO LOGIN:", error);

      Swal.fire({
        icon: "error",
        title: "Erro",
        text: "E-mail ou senha inválidos",
      });
    }
  }

  return { handleLogin };
}
