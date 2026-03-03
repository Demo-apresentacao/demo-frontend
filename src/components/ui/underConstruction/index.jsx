"use client";
import { HardHat, LogOut } from "lucide-react";
import { useAuth } from '@/hooks/useAuth'; // <-- Puxa do seu hook de ações
import styles from "./index.module.css"; // ajuste o caminho do css se precisar

export default function UnderConstruction() {
    const { logout } = useAuth(); // <-- Puxa a função perfeitinha que limpa cookies e storage

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <div className={styles.iconWrapper}>
                    <HardHat size={56} className={styles.icon} strokeWidth={1.5} />
                </div>
                
                <h1 className={styles.title}>Módulo em Desenvolvimento</h1>
                <p className={styles.message}>
                    A área exclusiva para clientes ainda está sendo construída com muito carinho e estará disponível em breve! 🚀
                </p>

                <div className={styles.alertBox}>
                    <strong>Você é da equipe?</strong>
                    <p>Se você é um funcionário, peça ao Administrador do sistema para alterar o seu perfil <b>Administrador</b> na tela de Usuários.</p>
                </div>

                <button onClick={logout} className={styles.button}>
                    <LogOut size={18} />
                    <span>Sair do Sistema</span>
                </button>
            </div>
        </div>
    );
}