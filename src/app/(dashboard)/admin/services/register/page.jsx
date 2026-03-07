"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";

import { ChevronLeft } from "lucide-react";

import { createService } from "@/services/services.service";

import { Can } from "@/components/ui/can";
import ServiceForm from "@/components/forms/servicesForm/servicesForm";
import AccessDenied from "@/components/ui/accessDenied";

import Swal from "sweetalert2";

import styles from "./page.module.css";

export default function RegisterServicePage() {
    const router = useRouter();

    const handleCreate = async (data) => {
        try {
            await createService(data);
            return { success: true };
        } catch (error) {
            console.error(error);
            Swal.fire({
                title: "Erro",
                text: error.response?.data?.message || "Erro ao criar serviço",
                icon: "error",
                confirmButtonColor: "#f59e0b"
            });
            return { success: false };
        }
    };

    const handleSuccess = () => {
        Swal.fire({
            title: "Sucesso!",
            text: "Serviço criado com sucesso.",
            icon: "success",
            confirmButtonColor: "#10b981"
        }).then(() => router.push("/admin/services"));
    };

    const handleCancel = () => {
        router.push("/admin/services");// Volta para a página anterior
    };

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Link href="/admin/services" className={styles.backLink}>
                    <ChevronLeft size={20} /> Voltar
                </Link>
                <h1 className={styles.title}>Cadastrar Novo Serviço</h1>
            </div>
            <div className={styles.formCard}>
                <Can perform="servicos.criar" fallback={<AccessDenied />}>
                    <ServiceForm
                        mode="create"
                        saveFunction={handleCreate}
                        onSuccess={handleSuccess}
                        onCancel={handleCancel}
                    />
                </Can>
            </div>
        </div>
    );
}