"use client"

import { useState } from "react"
import HeaderPanelUser from "@/components/headers/headerPanelUser/headerPanelUser"
import SidebarUser from "@/components/sidebars/sidebarUser/sidebarUser"
import { useAuthContext } from "@/contexts/AuthContext" // <-- Puxa os DADOS
import UnderConstruction from "@/components/ui/underConstruction"
import styles from "../layout.module.css"

export default function UserLayoutClient({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    
    // Pegamos a variável 'user' que agora existe no AuthContext!
    const { user, isReady } = useAuthContext();

    console.log("DADOS DO USUÁRIO:", user);

    const handleToggleSidebar = () => setSidebarOpen(!sidebarOpen);
    const closeSidebar = () => setSidebarOpen(false);

    // Se o contexto ainda tá carregando, espera. (Evita a tela branca!)
    if (!isReady) return null; 

    // A TRAVA MÁGICA: Se não for admin, mostra o capacete de obras
    if (user && user.acesso === false) {
        return <UnderConstruction />;
    }

    // Se for Admin, mostra o menu e o painel normalmente
    return (
        <div className={styles.container}>
            <HeaderPanelUser toggleSidebar={handleToggleSidebar} /> 
            <div className={styles.body}>
                <aside className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
                    <SidebarUser closeMobileMenu={closeSidebar} />
                </aside>
                {sidebarOpen && <div className={styles.overlay} onClick={closeSidebar} />}                
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    )
}