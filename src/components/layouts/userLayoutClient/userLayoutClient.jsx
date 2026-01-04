"use client"

import { useState } from "react"
import HeaderPanelUser from "@/components/headers/headerPanelUser/headerPanelUser"
import SidebarUser from "@/components/sidebars/sidebarUser/sidebarUser"
import styles from "../layout.module.css"

export default function UserLayoutClient({ children }) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    const handleToggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };      

    return (
        <div className={styles.container}>
            <HeaderPanelUser toggleSidebar={handleToggleSidebar} /> 
            <div className={styles.body}>
                <aside className={`${styles.sidebarWrapper} ${sidebarOpen ? styles.open : ''}`}>
                    {/* AQUI: Passamos a função closeSidebar para o componente filho */}
                    <SidebarUser closeMobileMenu={closeSidebar} />
                </aside>
                {sidebarOpen && (
                    <div className={styles.overlay} onClick={closeSidebar} />
                )}                
                <main className={styles.content}>
                    {children}
                </main>
            </div>
        </div>
    )
}