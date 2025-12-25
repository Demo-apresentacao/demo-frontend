"use client";

import { useRouter } from "next/navigation";
import RegisterUserForm from "@/components/registerUserForm/registerUserForm";
// import { userService } from "@/services/userService"; // Importe seu service direto
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import styles from "./page.module.css";

export default function RegisterUserPage() {
    const router = useRouter();

    // // Função que será passada para o formulário
    // const handleCreateUser = async (userData) => {
    //     try {
    //         await userService.createUser(userData);
    //         return { success: true };
    //     } catch (error) {
    //         console.error(error);
    //         return { success: false, error };
    //     }
    // };

    // Ações ao finalizar
    const handleSuccess = () => {
        alert("Usuário criado com sucesso!");
        router.push("/admin/users"); // Volta para a listagem
    };

    const handleCancel = () => {
        router.back(); // Volta para a página anterior
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/users" className={styles.backLink}>
                    <ChevronLeft size={20} />
                    Voltar
                </Link>
                <h1 className={styles.title}>Cadastrar Novo Usuário</h1>
            </div>

            <div className={styles.formCard}>
                <RegisterUserForm 
                    // createUserFunction={handleCreateUser}
                    onSuccess={handleSuccess}
                    onCancel={handleCancel}
                />
            </div>
        </div>
    );
}