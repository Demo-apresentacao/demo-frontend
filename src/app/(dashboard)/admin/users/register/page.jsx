"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import { registerUser } from "@/services/register.service";

import { Can } from "@/components/ui/can";
import UserFormAdmin from "@/components/forms/userForm/userFormAdmin/userFormAdmin";
import AccessDenied from "@/components/ui/accessDenied";

import Swal from "sweetalert2"; // Importando o SweetAlert

import styles from "./page.module.css";

export default function RegisterUserPage() {
    const router = useRouter();

    const handleCreateUser = async (userData) => {
        try {
            await registerUser(userData);
            return { success: true };
        } catch (error) {

            const status = error.response?.status;

            // Só loga no console se for erro grave (diferente de validação)
            if (!status || status >= 500) {
                console.error("Erro Crítico:", error);
            }

            let title = "Erro ao cadastrar";
            let text = "Ocorreu um erro inesperado.";

            if (error.response) {
                const { data } = error.response;

                if (data && data.message) text = data.message;
                else if (typeof data === 'string') text = data;

                if (status === 409) title = "Dado já existente"; // Título mais amigável
                if (status === 400) title = "Verifique os dados";
                if (status === 500) title = "Erro Interno";
            } else if (error.request) {
                text = "Sem conexão com o servidor.";
            }

            await Swal.fire({
                title: title,
                text: text,
                icon: "warning",
                confirmButtonColor: "#f59e0b"
            });

            return { success: false, error };
        }
    };

    // Ações ao finalizar com sucesso
    const handleSuccess = () => {
        Swal.fire({
            title: "Sucesso!",
            text: "Usuário criado com sucesso.",
            icon: "success",
            confirmButtonColor: "#10b981"
        }).then(() => {
            router.push("/admin/users"); // Só redireciona quando o usuário clicar no botão
        });
    };

    const handleCancel = () => {
        router.push("/admin/users");// Volta para a página anterior
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
                <Can perform="usuarios.criar" fallback={<AccessDenied />}>
                    <UserFormAdmin
                        mode="create"
                        saveFunction={handleCreateUser}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </Can>
            </div>
        </div>
    );
}