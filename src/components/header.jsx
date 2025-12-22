'use client'

import { useAuth } from '@/hooks/useAuth'

export function Header() {
  const { logout } = useAuth()

  return (
    <header>
      <button onClick={logout}>
        Sair
      </button>
    </header>
  )
}
