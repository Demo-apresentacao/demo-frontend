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
    
    // 1. NOVO: Adicionamos o estado para rastrear o Erro 403
    const [accessDenied, setAccessDenied] = useState(false); 
    
    const router = useRouter();

    const fetchPermissionsData = useCallback(async () => {
        setLoading(true);
        setAccessDenied(false); // 2. NOVO: Reseta o erro a cada nova busca

        try {
            const [allPermsData, userPermsData] = await Promise.all([
                getAllPermissions(),
                getUserPermissions(userId)
            ]);

            const allPermsArray = allPermsData.data || [];
            const userPermsArray = userPermsData.data || [];
            
            const grouped = allPermsArray.reduce((acc, perm) => {
                const [modulo] = perm.per_chave.split("."); 
                if (!acc[modulo]) acc[modulo] = [];
                acc[modulo].push(perm);
                return acc;
            }, {});

            setAllPermissions(grouped);
            setSelectedPerms(new Set(userPermsArray));
            setInitialParams(new Set(userPermsArray));

        } catch (error) {
            // 3. NOVO: Interceptamos o 403 para não mostrar o Swal de erro feio
            if (error.response?.status === 403) {
                setAccessDenied(true); 
            } else {
                console.error("Erro ao carregar permissões:", error);
                Swal.fire("Erro", "Não foi possível carregar as permissões.", "error");
            }
        } finally {
            setLoading(false);
        }
    }, [userId]);

    const handleToggle = (chave) => {
        setSelectedPerms((prev) => {
            const newSet = new Set(prev);
            if (newSet.has(chave)) {
                newSet.delete(chave); 
            } else {
                newSet.add(chave); 
            }
            return newSet;
        });
    };

    const handleSave = async () => {
        try {
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

            return true;

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
        hasUnsavedChanges,
        accessDenied // 4. NOVO: Exportamos essa variável para a tela ler!
    };
}