'use client'

import { useRouter } from 'next/navigation'

export function useAuth() {
  const router = useRouter()

  function logout() {
    // Limpa cookies
    document.cookie = 'auth=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'
    document.cookie = 'role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT'

    // Limpa storage (se estiver usando)
    localStorage.clear()
    sessionStorage.clear()

    // Redireciona para login
    router.push('/login')
  }

  return { logout }
}
