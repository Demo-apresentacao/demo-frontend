import Cookies from 'js-cookie';

export function useAuth() {
  
  function logout() {
    // 1. Limpar os cookies corretos
    // Precisamos remover 'logged' (que criamos no login) e 'role'
    // O { path: '/' } é crucial para garantir que apague em todo o site
    Cookies.remove('logged', { path: '/' });
    Cookies.remove('role', { path: '/' });

    // 2. Limpar dados específicos do localStorage
    // .clear() apaga TUDO (pode apagar preferências de tema, etc).
    // .removeItem('user') apaga só o que gravamos no login.
    localStorage.removeItem('user'); 
    
    // Opcional: Se usar sessionStorage, limpe também
    sessionStorage.clear();

    // 3. Redirecionamento "Hard" (Recomendado)
    // Em vez de router.push('/login'), usamos window.location.href.
    // Isso força o navegador a recarregar a página do zero, limpando
    // qualquer estado de memória (states, context api) do usuário anterior.
    window.location.href = '/login';
  }

  return { logout };
}