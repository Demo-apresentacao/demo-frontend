"use client"

import { House, Users, Car, Wrench, CalendarCheck, History, CalendarDays, Calculator } from "lucide-react"

import ItemSidebar from "@/components/ui/itemSidebar/itemSidebar"
import { Can } from "@/components/ui/can"

import styles from "../sidebar.module.css"

// 1. Adicionamos a propriedade "permission" aos itens que precisam de bloqueio
const menuItems = [
    { label: "Dashboard", href: "/admin", icon: House }, // Sem restrição (livre para todos)
    { label: "Usuários", href: "/admin/users", icon: Users, permission: "usuarios.listar" },
    { label: "Veículos", href: "/admin/vehicles", icon: Car, permission: "veiculos.listar" },
    { label: "Serviços", href: "/admin/services", icon: Wrench, permission: "servicos.listar" },
    { label: "Agendamentos", href: "/admin/appointments", icon: CalendarCheck, permission: "agendamentos.listar" },
    { label: "Calendário", href: "/admin/schedule", icon: CalendarDays, permission: "calendario.visualizar" }, // Assumindo que usa a mesma da agenda
    { label: "Calculadora", href: "/admin/calculator", icon: Calculator }, // Sem restrição
];

export default function SidebarAdmin({ closeMobileMenu }) {

    return (
        <aside className={styles.sidebar}>
            <nav>
                {menuItems.map((item, index) => {
                    
                    // Se o item tem uma permissão exigida, abraçamos ele com o <Can>
                    if (item.permission) {
                        return (
                            <Can key={index} perform={item.permission}>
                                <ItemSidebar
                                    label={item.label}
                                    icon={item.icon}
                                    href={item.href}
                                    onClick={closeMobileMenu}
                                />
                            </Can>
                        );
                    }

                    // Se não tem permissão exigida (ex: Dashboard), renderiza direto
                    return (
                        <ItemSidebar
                            key={index}
                            label={item.label}
                            icon={item.icon}
                            href={item.href}
                            onClick={closeMobileMenu}
                        />
                    );
                })}
            </nav>
        </aside>
    );
}