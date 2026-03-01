"use client";
import { useState, useCallback } from "react";
import { getAllPermissions, getUserPermissions, updateUserPermissions } from "@/services/permissions.service";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

export function useUserPermissions(userId) {
    const [allPermissions, setAllPermissions] = useState({});
    const [selectedPerms, setSelectedPerms] = useState(new Set());
    const [initialParams, setInitialParams] = useState(new Set());
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    // Busca os dados e agrupa
    const fetchPermissionsData = useCallback(async () => {
        setLoading(true);
        try {
            // Faz as duas requisições ao mesmo tempo para ser mais rápido
            const [allPermsData, userPermsData] = await Promise.all([
                getAllPermissions(),
                getUserPermissions(userId)
            ]);

            const allPermsArray = allPermsData.data || [];
            const userPermsArray = userPermsData.data || [];
            // AGRUPAMENTO: Transforma o array em um objeto separado por módulos
            // Ex: { "usuarios": [{per_chave: "usuarios.listar", ...}], "veiculos": [...] }
            const grouped = allPermsArray.reduce((acc, perm) => {
                const [modulo] = perm.per_chave.split("."); // Pega a palavra antes do ponto
                if (!acc[modulo]) acc[modulo] = [];
                acc[modulo].push(perm);
                return acc;
            }, {});

            setAllPermissions(grouped);

            // Salva as permissões que o usuário já tem em um Set (lista otimizada)
            setSelectedPerms(new Set(userPermsArray));
            setInitialParams(new Set(userPermsArray));

        } catch (error) {
            console.error("Erro ao carregar permissões:", error);
            Swal.fire("Erro", "Não foi possível carregar as permissões.", "error");
        } finally {
            setLoading(false);
        }
    }, [userId]);

    // Função disparada ao clicar no Toggle/Checkbox
    const handleToggle = (chave) => {
        setSelectedPerms((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(chave)) {
                newSet.delete(chave); // Se já tem, remove (desmarca)
            } else {
                newSet.add(chave); // Se não tem, adiciona (marca)
            }
            return newSet;
        });
    };

    // Salvar no backend
    const handleSave = async () => {
        try {
            // Converte o Set de volta para Array antes de enviar pro backend
            const permissionsArray = Array.from(selectedPerms);

            await updateUserPermissions(userId, permissionsArray);

            setInitialParams(new Set(selectedPerms));

            Swal.fire({
                title: "Sucesso!",
                text: "Permissões atualizadas com sucesso.",
                icon: "success",
                confirmButtonColor: "#16a34a",
                background: "#ffffff",
                color: "#111827"
            });

            router.push("/admin/users");


        } catch (error) {
            console.error("Erro ao salvar:", error);
            Swal.fire("Erro", "Falha ao salvar as permissões.", "error");
        }
    };

    const hasUnsavedChanges =
        selectedPerms.size !== initialParams.size ||
        [...selectedPerms].some(perm => !initialParams.has(perm));

    return {
        allPermissions,
        selectedPerms,
        loading,
        fetchPermissionsData,
        handleToggle,
        handleSave,
        hasUnsavedChanges
    };
}